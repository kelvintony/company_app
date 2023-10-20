import { getSession } from 'next-auth/react';
import { getToken } from 'next-auth/jwt';
import { Decimal128 } from 'mongodb';

import db from '../../../../utils/db';
import walletProfileModel from '../../../../models/walletProfile';

export default async (req, res) => {
  if (req.method === 'GET') {
    return validateWithdrawAmount(req, res);
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

    const formattedBalance = {
      withdrawableBalance: foundUser?.withdrawableBalance,
    };

    const decimal128Value = formattedBalance.withdrawableBalance;
    const withdrawableBalance = parseFloat(decimal128Value.toString());

    if (convertedAmount > withdrawableBalance) {
      return res
        .status(500)
        .json({ message: 'Amount is greater than your withdrawable balance' });
    }
    return res.status(200).json('You may proceed');
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
