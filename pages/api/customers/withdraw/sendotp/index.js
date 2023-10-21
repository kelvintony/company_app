import { Resend } from 'resend';
import { getSession } from 'next-auth/react';

import userModel from '../../../../../models/user';
import Token from '../../../../../models/token';
import db from '../../../../../utils/db';

const RESEND_API_KEY = `${process.env.RESEND_API_KEY}`;

const resend = new Resend(RESEND_API_KEY);

const generateOTP = () => {
  const min = 100000;
  const max = 999999;
  const otpCode = Math.floor(Math.random() * (max - min + 1)) + min;
  return otpCode;
};

export default async (req, res) => {
  await db.connect();
  switch (req.method) {
    case 'GET':
      await sendOTP(req, res);
      break;

    default:
      res.status(409).json({ message: 'method does not exist' });
  }
};

export const sendOTP = async (req, res) => {
  const session = await getSession({ req });

  if (!session) {
    return res.status(401).send('you are not authenticated');
  }

  try {
    const user = await userModel.findOne({ email: session.user.email });

    if (!user) return res.status(404).json({ message: 'Email does not exist' });

    const foundUserToken = Token.findOne({
      userId: user._id,
    });

    if (foundUserToken) {
      await foundUserToken.deleteOne();
    }

    // const foundAlreadyExistingEmail = findOne({});

    let newToken = new Token({
      userId: session.user._id,
      token: generateOTP(),
    });
    await newToken.save();

    const savedToken = newToken.token;

    const message = `This is your OTP(One Time Password) for amount withdrawal: <br> <br> <strong>${savedToken}</strong> <br> <br> If you have not requested this email please ignore`;

    const data = await resend.emails.send({
      from: 'dexomPay <noreply@dexompay.com>',
      to: session.user.email,
      subject: 'Amount Withdrawal Link',
      html: message,
    });

    if (!data) {
      console.log(response);
      throw new Error('something went wwrong');
    }

    res.status(200).json({
      message: 'OTP(One Time Password) has been sent to your email address',
    });
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong' });
    console.log(error.message);
  }
};
