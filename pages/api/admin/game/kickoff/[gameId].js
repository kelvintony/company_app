import { getSession } from 'next-auth/react';
import { getToken } from 'next-auth/jwt';

import db from '../../../../../utils/db';
import gameModel from '../../../../../models/game';

export default async (req, res) => {
  await db.connect();

  if (req.method === 'POST') {
    return kickStartGame(req, res);
  } else if (req.method === 'GET') {
    return unlockGame(req, res);
  } else {
    return res.status(400).send({ message: 'Method not allowed' });
  }
};

export const kickStartGame = async (req, res) => {
  try {
    // const user = await getToken({
    //   req,
    //   secret: process.env.NEXTAUTH_SECRET,
    // });

    // if (!user || (user && !user.superUser)) {
    //   return res.status(401).send('signin required');
    // }

    const session = await getSession({ req });

    if (!session || (session && !session.user.superUser)) {
      return res.status(401).send('you are not authenticated');
    }
    const gameId = req.query.gameId;

    await gameModel.findByIdAndUpdate(
      gameId,
      {
        eventMode: 'running',
      },
      { new: true }
    );

    return res.status(200).json({ message: 'game kickstarted successfully' });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

export const unlockGame = async (req, res) => {
  try {
    const session = await getSession({ req });

    if (!session || (session && !session.user.superUser)) {
      return res.status(401).send('you are not authenticated');
    }

    const gameId = req.query.gameId;

    await gameModel.findByIdAndUpdate(
      gameId,
      {
        status: { locked: false },
      },
      { new: true }
    );

    return res.status(200).json({ message: 'game unlocked successfully' });
  } catch (error) {
    console.log(error.message);
    return res.status(400).json({ message: error.message });
  }
};
