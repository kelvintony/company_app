import { getSession } from 'next-auth/react';
import db from '../../../../../utils/db';
import walletProfileModel from '../../../../../models/walletProfile';
const { Decimal128 } = require('mongodb');

export default async (req, res) => {
  if (req.method === 'GET') {
    return transferBonusToBalance(req, res);
  } else {
    return res.status(400).send({ message: 'Method not allowed' });
  }
};

export const transferBonusToBalance = async (req, res) => {
  const session = await getSession({ req });

  if (!session) {
    return res.status(401).send({ message: 'you are not authenticated' });
  }

  try {
    await db.connect();

    const userWalletProfile = await walletProfileModel.findOne({
      userId: session.user._id,
      // userId: '64f8bea4381305e13619b884',
    });

    if (!userWalletProfile) {
      return res.status(404).json({ message: 'User profile not found' });
    }

    //!convert withdrawable balance and bonus to float
    const withdrawableBalance = parseFloat(
      userWalletProfile?.withdrawableBalance?.toString()
    );

    const withdrawablereferralBonusBalance = parseFloat(
      userWalletProfile?.referralBonus?.toString()
    );

    if (withdrawablereferralBonusBalance <= 0) {
      return res.status(400).json({ message: 'you do not have any bonus' });
    }
    //* sum balance and bonus
    const sum = withdrawableBalance + withdrawablereferralBonusBalance;
    //! ends here

    // Update the user's wallet profile
    const updateOne = {
      $set: {
        referralBonus: 0,
        withdrawableBalance: Number(sum.toFixed(2)),
      },
    };

    await walletProfileModel.findOneAndUpdate(
      { userId: session.user._id },
      // { userId: '64f8bea4381305e13619b884' },
      updateOne
    );

    return res.status(200).json({ message: 'Transfer was successful' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
