import { getSession } from 'next-auth/react';
import orderModel from '../../../models/order';
import transactionProfileModel from '../../../models/transactionProfile';
import db from '../../../utils/db';

export default async (req, res) => {
  await db.connect();

  if (req.method === 'GET') {
    return fetchTransactions(req, res);
  } else {
    return res.status(400).send({ message: 'Method not allowed' });
  }
};

export const fetchTransactions = async (req, res) => {
  try {
    const session = await getSession({ req });

    if (!session) {
      return res.status(401).json({ message: 'you are not authenticated' });
    }
    const userProfile = session.user;

    await transactionProfileModel.findOneAndUpdate(
      { userId: userProfile._id },
      { accountType: 'reseller', $inc: { accountBalance: -4999 } },
      {
        new: true,
      }
    );

    return res.status(200).json({ message: 'Account Upgraded Successfully' });
  } catch (error) {
    return res.status(400).json({ message: 'something went wrong' });
    //   return res.status(400).json({ message: error.message });
  }
};
