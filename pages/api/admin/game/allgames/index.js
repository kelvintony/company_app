import { getSession } from 'next-auth/react';
import { getToken } from 'next-auth/jwt';

import db from '../../../../../utils/db';
import tradedGameModel from '../../../../../models/tradedGame';

export default async (req, res) => {
  if (req.method === 'POST') {
    return createGame(req, res);
  } else if (req.method === 'GET') {
    return getAllGames(req, res);
  } else {
    return res.status(400).send({ message: 'Method not allowed' });
  }
};

export const createGame = async (req, res) => {};

export const getAllGames = async (req, res) => {
  const session = await getSession({ req });

  if (!session || (session && !session.user.superUser)) {
    return res.status(401).send('you are not authenticated');
  }

  try {
    await db.connect();

    const latestDocument = await tradedGameModel
      .find({})
      .sort({ _id: -1 })
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
