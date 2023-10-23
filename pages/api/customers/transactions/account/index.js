import { getSession } from 'next-auth/react';
import { getToken } from 'next-auth/jwt';

import db from '../../../../../utils/db';
import tradedGameModel from '../../../../../models/tradedGame';

export default async (req, res) => {
  if (req.method === 'GET') {
    return getAccountHistory(req, res);
  } else {
    return res.status(400).send({ message: 'Method not allowed' });
  }
};

export const getAccountHistory = async (req, res) => {
  const session = await getSession({ req });

  if (!session) {
    return res.status(401).send('you are not authenticated');
  }

  try {
    await db.connect();

    const latestDocument = await tradedGameModel
      .find({ userId: session.user._id })
      .sort({ createdAt: -1 })
      .populate([
        {
          path: 'gameId',
          select: 'eventSelection eventDate eventTime _id',
        },
        {
          path: 'userId',
          select: 'fullName',
        },
      ])
      .select('-updatedAt -eventOneStats -eventTwoStats');

    return res.status(200).json({ message: latestDocument });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};
