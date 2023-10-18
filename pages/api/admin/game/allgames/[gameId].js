import { getSession } from 'next-auth/react';
import { getToken } from 'next-auth/jwt';

import db from '../../../../../utils/db';
import tradedGameModel from '../../../../../models/tradedGame';
import walletProfileModel from '../../../../../models/walletProfile';

const concludeUserTradePassword = process.env.CONCLUDE_USER_TRADE_PASSWORD;

export default async (req, res) => {
  if (req.method === 'PUT') {
    return processUserTrade(req, res);
  } else if (req.method === 'GET') {
    return getSingleGameTradedByUser(req, res);
  } else {
    return res.status(400).send({ message: 'Method not allowed' });
  }
};

export const processUserTrade = async (req, res) => {
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

    const foundUserWallet = await walletProfileModel.findOne({
      userId: userId,
    });

    const foundTradedGame = await tradedGameModel.findById(gameId);

    if (foundTradedGame.isUserTradeProcessed === true) {
      return res.status(401).json({ message: 'Game already settled' });
    }

    foundTradedGame.isUserTradeProcessed = true;

    if (selectedEvent === 'event 1') {
      foundUserWallet.accountBalance += eventOneExpectedReturns;
      foundUserWallet.roi += eventOneRoi;
      foundUserWallet.withdrawableBalance += eventOneRoi;

      await foundUserWallet.save();
    } else {
      foundUserWallet.accountBalance += eventTwoExpectedReturns;
      foundUserWallet.roi += eventTwoRoi;
      foundUserWallet.withdrawableBalance += eventTwoRoi;

      await foundUserWallet.save();
    }

    await foundTradedGame.save();

    return res.status(200).json({ message: 'Trade processed successful' });
  } catch (error) {
    console.log(error.message);
    return res.status(400).json({ message: error.message });
  }
};

export const getSingleGameTradedByUser = async (req, res) => {
  const session = await getSession({ req });

  if (!session || (session && !session.user.superUser)) {
    return res.status(401).send('you are not authenticated');
  }

  const gameId = req.query.gameId;

  try {
    await db.connect();

    const latestDocument = await tradedGameModel
      .findById(gameId)
      .select('-updatedAt -createdAt -gameId');

    return res.status(200).json({ message: latestDocument });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};
