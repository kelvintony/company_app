import { getSession } from 'next-auth/react';
import { getToken } from 'next-auth/jwt';
import { Decimal128 } from 'mongodb';
import Token from '../../../../models/token';
import accountHistoryModel from '../../../../models/accountHistory';

import db from '../../../../utils/db';
import walletProfileModel from '../../../../models/walletProfile';

export default async (req, res) => {
  if (req.method === 'GET') {
    return validateWithdrawAmount(req, res);
  } else if (req.method === 'POST') {
    return placeWithdrawal(req, res);
  } else {
    return res.status(400).send({ message: 'Method not allowed' });
  }
};

export const validateWithdrawAmount = async (req, res) => {
  const session = await getSession({ req });

  const userProfile = session.user;

  if (!session) {
    return res.status(401).send('you are not authenticated');
  }

  const withdrawAmount = req.query.amount;

  const convertedAmount = Number(withdrawAmount.replace(/,/g, ''));

  try {
    await db.connect();

    let foundUser = await walletProfileModel.findOne({
      userId: userProfile._id,
    });

    //! convert amount to float
    const formattedBalance = {
      withdrawableBalance: foundUser?.withdrawableBalance,
    };

    const decimal128Value = formattedBalance.withdrawableBalance;
    const withdrawableBalance = parseFloat(decimal128Value.toString());
    //! convertion ends here

    if (convertedAmount > withdrawableBalance) {
      return res
        .status(500)
        .json({ message: 'Amount is greater than your withdrawable balance' });
    }

    return res.status(200).json({ message: 'Amount validated' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const placeWithdrawal = async (req, res) => {
  const session = await getSession({ req });

  const userProfile = session.user;

  if (!session) {
    return res.status(401).send('you are not authenticated');
  }

  const { amount, otp } = req.body;

  const convertedAmount = Number(amount.replace(/,/g, ''));

  try {
    await db.connect();

    let foundUser = await walletProfileModel.findOne({
      userId: userProfile._id,
    });

    const oldToken = await Token.findOne({
      userId: session.user._id,
      token: otp,
    });

    //! convert amount to float
    const formattedBalance = {
      withdrawableBalance: foundUser?.withdrawableBalance,
    };
    const decimal128Value = formattedBalance.withdrawableBalance;
    const withdrawableBalance = parseFloat(decimal128Value.toString());
    //! convertion ends here

    if (convertedAmount <= 0) {
      return res
        .status(500)
        .json({ message: 'we do not accept negative value' });
    }

    if (convertedAmount > withdrawableBalance) {
      return res
        .status(500)
        .json({ message: 'Amount is greater than your withdrawable balance' });
    }

    if (!oldToken) {
      return res.status(400).json({ message: 'OTP does not exist' });
    }

    const updateOne = {
      $inc: {
        accountBalance: -convertedAmount,
        roi: -convertedAmount,
        withdrawableBalance: -convertedAmount,
      },
    };

    await walletProfileModel.findOneAndUpdate(
      { userId: session.user._id },
      updateOne
    );

    await accountHistoryModel.create({
      userId: session.user._id,
      paymentStatus: 'pending',
      amount: convertedAmount,
      whatFor: 'wallet Withdrawal',
      transactionId: { type: String },
    });
    // await oldToken.deleteOne();

    return res
      .status(200)
      .json({ message: "Withraw was successful and it's been processed " });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
