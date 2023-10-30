import bcryptjs from 'bcryptjs';
import userModel from '../../../models/user';
import db from '../../../utils/db';
import tokenModel from '../../../models/token';
import walletProfileModel from '../../../models/walletProfile';
import referralModel from '../../../models/referral';

import { Resend } from 'resend';
import crypto from 'crypto';

const RESEND_API_KEY = `${process.env.RESEND_API_KEY}`;
const resend = new Resend(RESEND_API_KEY);

async function handler(req, res) {
  if (req.method !== 'POST') {
    return;
  }
  const {
    firstName,
    lastName,
    walletAddress,
    email,
    password,
    confirmPassword,
    userName,
    referralId,
  } = req.body;
  if (
    !firstName ||
    !lastName ||
    !email ||
    !email.includes('@') ||
    !password ||
    !walletAddress ||
    !userName
  ) {
    return res.status(409).json({
      message: 'Validation error',
    });
  }

  try {
    await db.connect();

    const existingUser = await userModel.findOne({ email: email });
    const existingUserName = await userModel.findOne({ userName: userName });

    if (existingUser) {
      return res.status(409).json({ message: 'Email already exists!' });
    }

    if (existingUserName) {
      return res.status(409).json({ message: 'Username already exists!' });
    }

    if (password !== confirmPassword) {
      return res.status(409).json({
        message: 'Password must match',
      });
    }

    // const hashedPassword = await bcryptjs.hash(password, 12);

    const newUser = await userModel.create({
      firstName,
      lastName,
      fullName: `${firstName} ${lastName}`,
      walletAddress,
      email,
      password: bcryptjs.hashSync(password),
      superUser: false,
      userName: userName.toLowerCase(),
    });

    if (referralId) {
      const foundReferral = await referralModel.findOne({
        referralId: referralId.toLowerCase(),
      });

      if (foundReferral) {
        foundReferral.referredUsers.push({
          userId: newUser._id,
          isUserBonusAdded: false,
        });
        await foundReferral.save();
      }
    }

    //! create wallet profile
    await walletProfileModel.create({
      userId: newUser?._id,
    });

    //! create user referral system
    await referralModel.create({
      userId: newUser._id,
      referralId: userName.toLowerCase(),
    });
    //! create the token

    let newToken = new tokenModel({
      userId: newUser._id,
      token: crypto.randomBytes(32).toString('hex'),
    });
    await newToken.save();

    const url = `https://dpayai.vercel.app/auth/verify-account?userid=${newUser._id}&token=${newToken.token}`;

    const message = `Click this link to verify your account: ${url} <br> If you have not requested this email please ignore`;

    const data = await resend.emails.send({
      from: 'DexomPay <noreply@dexompay.com>',
      to: newUser.email,
      subject: 'Verify Account',
      html: message,
    });

    if (!data) {
      throw new Error('something went wwrong');
    }
    //! Token creation ends here

    return res.status(201).send({
      message:
        'Registration successful!, Email has been sent, kindly check your inbox or spam to verify account',
    });
  } catch (error) {
    return res.status(409).json({ message: error.message });
  }
}

export default handler;
