import { getSession } from 'next-auth/react';
import { getToken } from 'next-auth/jwt';

import db from '../../../../../utils/db';
import tradedGameModel from '../../../../../models/tradedGame';

export default async (req, res) => {
  if (req.method === 'POST') {
    return createGame(req, res);
  } else if (req.method === 'GET') {
    return getSingleGameTradedByUser(req, res);
  } else {
    return res.status(400).send({ message: 'Method not allowed' });
  }
};

export const createGame = async (req, res) => {};

export const getSingleGameTradedByUser = async (req, res) => {
  await db.connect();

  //   const session = await getSession({ req });

  //   if (!session || (session && !session.user.superUser)) {
  //     return res.status(401).send('you are not authenticated');
  //   }

  const gameId = req.query.gameId;

  try {
    const latestDocument = await tradedGameModel
      .findById(gameId)
      .select('-updatedAt -createdAt -gameId');

    return res.status(200).json({ message: latestDocument });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};
