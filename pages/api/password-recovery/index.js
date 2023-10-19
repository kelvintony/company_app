import db from '../../../utils/db';
import userModel from '../../../models/user';
import Token from '../../../models/token';
import crypto from 'crypto';
import { Resend } from 'resend';
import bcryptjs from 'bcryptjs';

const RESEND_API_KEY = `${process.env.RESEND_API_KEY}`;

const resend = new Resend(RESEND_API_KEY);

export default async (req, res) => {
  await db.connect();
  switch (req.method) {
    case 'POST':
      await sendPasswordLink(req, res);
      break;

    case 'GET':
      await verifyPasswordLink(req, res);
      break;

    default:
      res.status(409).json({ message: 'method does not exist' });
  }
};

export const sendPasswordLink = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await userModel.findOne({ email });

    if (!user) return res.status(404).json({ message: 'Email does not exist' });

    const foundUserToken = Token.findOne({
      userId: user._id,
    });

    if (foundUserToken) {
      await foundUserToken.deleteOne();
    }

    // const foundAlreadyExistingEmail = findOne({});

    let newToken = new Token({
      userId: user._id,
      token: crypto.randomBytes(32).toString('hex'),
    });
    await newToken.save();

    // const url = `http://localhost:3000/password-reset/${user._id}/${newToken.token}`;
    const url = `https://dpayai.vercel.app/auth/reset-password?userid=${user._id}&token=${newToken.token}`;

    const message = `Click this link to reset your password: ${url} <br> <br> If you have not requested this email please ignore`;

    const data = await resend.emails.send({
      from: 'dexomPay <noreply@dexompay.com>',
      to: email,
      subject: 'Password Reset Link',
      html: message,
    });

    if (!data) {
      console.log(response);
      throw new Error('something went wwrong');
    }

    res.status(200).json({
      message: 'password reset link has been sent to your email account',
    });
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong' });
    console.log(error.message);
  }
};

export const verifyPasswordLink = async (req, res) => {
  const userid = req.query.userid;
  const token = req.query.token;

  const { password, confirmPassword } = req.body;

  try {
    const user = await userModel.findOne({ _id: userid });

    if (!user) return res.status(400).json({ message: 'User does not exist' });

    if (password !== confirmPassword)
      return res.status(400).json({ message: 'Password must match' });

    const orderToken = await Token.findOne({
      userId: userid,
      token: token,
    });

    if (!orderToken) {
      return res.status(400).json({ message: 'token does not exist' });
    }

    // if (!user.verified) {
    //   user.verified = true;
    // }

    if (password === confirmPassword) {
      const hashedPassword = await bcryptjs.hashSync(password);

      user.password = hashedPassword;

      await user.save();

      await orderToken.deleteOne();

      res.status(200).json({ message: 'password reset successful' });
    }
  } catch (error) {
    res.status(500).json({ message: 'something went wrong' });
    console.log(error.message);
  }
};
