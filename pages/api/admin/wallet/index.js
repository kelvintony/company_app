import { getSession } from 'next-auth/react';
import { getToken } from 'next-auth/jwt';

import db from '../../../../utils/db';
import accountHistoryModel from '../../../../models/accountHistory';

export default async (req, res) => {
  if (req.method === 'POST') {
    return createGame(req, res);
  } else if (req.method === 'GET') {
    return getAllOrders(req, res);
  } else {
    return res.status(400).send({ message: 'Method not allowed' });
  }
};

export const createGame = async (req, res) => {};

export const getAllOrders = async (req, res) => {
  const session = await getSession({ req });

  if (!session || (session && !session.user.superUser)) {
    return res.status(401).send('you are not authenticated');
  }

  try {
    await db.connect();

    const latestDocument = await accountHistoryModel
      .find({})
      .sort({ _id: -1 })
      .populate({
        path: 'userId',
        select: 'fullName walletAddress',
      })
      .select('-updatedAt');

    return res.status(200).json({ message: latestDocument });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};
