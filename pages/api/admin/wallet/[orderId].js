import { getSession } from 'next-auth/react';
import { getToken } from 'next-auth/jwt';

import db from '../../../../utils/db';
import accountHistoryModel from '../../../../models/accountHistory';

import tradedGameModel from '../../../../models/tradedGame';
import walletProfileModel from '../../../../models/walletProfile';

const concludeUserTradePassword = process.env.CONCLUDE_USER_TRADE_PASSWORD;

export default async (req, res) => {
  if (req.method === 'PUT') {
    return processUserOrder(req, res);
  } else if (req.method === 'GET') {
    return getSingleOrderByUser(req, res);
  } else {
    return res.status(400).send({ message: 'Method not allowed' });
  }
};

export const processUserOrder = async (req, res) => {
  const session = await getSession({ req });

  if (!session || (session && !session.user.superUser)) {
    return res.status(401).send('you are not authenticated');
  }

  const gameId = req.query.gameId;

  try {
    await db.connect();

    // console.log('id', gameId);
    // console.log('body', req.body);

    const {
      userId,
      password,
      eventOneExpectedReturns,
      eventOneRoi,
      eventTwoExpectedReturns,
      eventTwoRoi,
      concludeTrade,
      selectedEvent,
    } = req.body;

    if (password !== concludeUserTradePassword) {
      return res.status(401).json({ message: 'Password is incorrect' });
    }

    if (!concludeTrade) {
      return res
        .status(401)
        .json({ message: 'kindly check the complete trade' });
    }

    const foundUserWallet = await walletProfileModel.findOne({
      userId: userId,
    });

    const foundTradedGame = await tradedGameModel.findById(gameId);

    if (foundTradedGame) {
      return res.status(401).json({ message: 'Game already settled' });
    }

    if (foundTradedGame.isUserTradeProcessed === true) {
      return res.status(401).json({ message: 'Game already settled' });
    }

    foundTradedGame.isUserTradeProcessed = true;
    foundTradedGame.concludedEvent = selectedEvent;

    if (selectedEvent === 'event 1') {
      const updateOne = {
        $inc: {
          accountBalance: eventOneExpectedReturns,
          roi: eventOneRoi,
          withdrawableBalance: eventOneRoi,
        },
      };

      await walletProfileModel.findOneAndUpdate({ userId: userId }, updateOne);
    } else {
      const updateTwo = {
        $inc: {
          accountBalance: eventTwoExpectedReturns,
          roi: eventTwoRoi,
          withdrawableBalance: eventTwoRoi,
        },
      };

      await walletProfileModel.findOneAndUpdate({ userId: userId }, updateTwo);
    }

    await foundTradedGame.save();

    return res.status(200).json({ message: 'Trade processed successful' });
  } catch (error) {
    console.log(error.message);
    return res.status(400).json({ message: error.message });
  }
};

export const getSingleOrderByUser = async (req, res) => {
  const session = await getSession({ req });

  if (!session || (session && !session.user.superUser)) {
    return res.status(401).send('you are not authenticated');
  }

  const orderId = req.query.orderId;

  try {
    await db.connect();

    const latestDocument = await accountHistoryModel
      .findById(orderId)
      .populate({
        path: 'userId',
        select: 'fullName walletAddress',
      })
      .select('-updatedAt -createdAt');

    return res.status(200).json({ message: latestDocument });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};
