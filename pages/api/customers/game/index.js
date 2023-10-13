import { getSession } from 'next-auth/react';
import { getToken } from 'next-auth/jwt';

import db from '../../../../utils/db';
import gameModel from '../../../../models/game';

export default async (req, res) => {
  if (req.method === 'POST') {
    return editGame(req, res);
  } else if (req.method === 'GET') {
    return getGame(req, res);
  } else if (req.method === 'PUT') {
    return cancelGame(req, res);
  } else {
    return res.status(400).send({ message: 'Method not allowed' });
  }
};

export const editGame = async (req, res) => {
  try {
    await db.connect();

    // const user = await getToken({
    //   req,
    //   secret: process.env.NEXTAUTH_SECRET,
    // });

    // if (!user || (user && !user.superUser)) {
    //   return res.status(401).send('signin required');
    // }

    const session = await getSession({ req });

    if (!session) {
      return res.status(401).send('you are not authenticated');
    }
    const gameId = req.query.gameId;

    await gameModel.findByIdAndUpdate(
      gameId,
      {
        eventMode: 'completed',
        concludedEvent: req?.body?.selectedEvent,
        gameDescription: 'latest game',
      },
      { new: true }
    );

    return res.status(200).json({ message: 'game updated successfully' });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

export const cancelGame = async (req, res) => {
  try {
    await db.connect();

    // const user = await getToken({
    //   req,
    //   secret: process.env.NEXTAUTH_SECRET,
    // });

    // if (!user || (user && !user.superUser)) {
    //   return res.status(401).send('signin required');
    // }

    const session = await getSession({ req });

    if (!session) {
      return res.status(401).send('you are not authenticated');
    }
    const gameId = req.query.gameId;

    await gameModel.findByIdAndUpdate(
      gameId,
      {
        eventMode: 'cancelled',
        gameDescription: 'latest game',
      },
      { new: true }
    );

    return res.status(200).json({ message: 'game updated successfully' });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

export const getGame = async (req, res) => {
  //   try {
  //     const findGame = await gameModel.findOne({
  //       eventMode: 'pending' || 'running',
  //     });
  //     return res.status(200).json({ message: findGame });
  //   } catch (error) {
  //     console.log(error.message);
  //     return res.status(400).json({ message: error.message });
  //   }
};
