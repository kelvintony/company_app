import { getSession } from 'next-auth/react';
import { getToken } from 'next-auth/jwt';

import db from '../../../../../utils/db';
import gameModel from '../../../../../models/game';

import tradedGameModel from '../../../../../models/tradedGame';
import walletProfileModel from '../../../../../models/walletProfile';

const handler = async (req, res) => {
  if (req.method === 'POST') {
    return concludeGame(req, res);
  } else if (req.method === 'PUT') {
    return cancelGame(req, res);
  } else {
    return res.status(400).send({ message: 'Method not allowed' });
  }
};

const concludeGame = async (req, res) => {
  try {
    await db.connect();

    const session = await getSession({ req });

    if (!session || (session && !session.user.superUser)) {
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

const cancelGame = async (req, res) => {
  try {
    await db.connect();

    const session = await getSession({ req });

    if (!session || (session && !session.user.superUser)) {
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

export default handler;
