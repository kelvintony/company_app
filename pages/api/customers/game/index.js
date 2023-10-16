import { getSession } from 'next-auth/react';
import { getToken } from 'next-auth/jwt';

import db from '../../../../utils/db';
import gameModel from '../../../../models/game';
import tradedGameModel from '../../../../models/tradedGame';
import walletProfileModel from '../../../../models/walletProfile';

export default async (req, res) => {
  if (req.method === 'POST') {
    return tradeGame(req, res);
  } else if (req.method === 'GET') {
    return getGame(req, res);
  } else if (req.method === 'PUT') {
    return cancelGame(req, res);
  } else {
    return res.status(400).send({ message: 'Method not allowed' });
  }
};

export const tradeGame = async (req, res) => {
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
    const gameId = req.body.gameInfo._id;

    const foundGame = await gameModel.findById(gameId);

    const foundUserWallet = await walletProfileModel.findOne({
      userId: session.user._id,
    });

    const foundGamePlayedByUser = await tradedGameModel.find({
      userId: session.user._id,
      gameId: gameId,
    });

    if (foundUserWallet.accountBalance < 5) {
      return res.status(500).json({
        message: 'your account balance is low, should not be less than $5',
      });
    }

    if (foundGamePlayedByUser.length > 0) {
      return res.status(400).json({ message: 'Event already traded' });
    }

    if (!foundGame) {
      return res.status(400).json({ message: 'Trade does not exist' });
    }

    if (foundGame.status.locked === true) {
      return res.status(400).json({ message: 'Trade is locked' });
    }

    if (foundGame.eventMode === 'running') {
      return res.status(400).json({ message: 'Trade already running' });
    }

    let odd1 = foundGame.eventOption1Odd;
    let odd2 = foundGame.eventOption2Odd;
    let currentEquity = foundUserWallet.equity;

    //! @ for Event One
    let percetageStakeForEventOne = 0;
    let eventOneTotalEquity = 0;
    let eventOneExpectedReturns = 0;
    let eventOneRoi = 0;

    percetageStakeForEventOne = ((1 / odd1) * 100) / (1 / odd1 + 1 / odd2);
    eventOneTotalEquity = (percetageStakeForEventOne * currentEquity) / 100;
    eventOneExpectedReturns = eventOneTotalEquity * odd1;
    eventOneRoi = eventOneExpectedReturns - currentEquity;

    //! @ for Event Two
    let percetageStakeForEventTwo = 0;
    let eventTwoTotalEquity = 0;
    let eventTwoExpectedReturns = 0;
    let eventTwoRoi = 0;

    percetageStakeForEventTwo = ((1 / odd2) * 100) / (1 / odd1 + 1 / odd2);
    eventTwoTotalEquity = (percetageStakeForEventTwo * currentEquity) / 100;
    eventTwoExpectedReturns = eventTwoTotalEquity * odd2;
    eventTwoRoi = eventTwoExpectedReturns - currentEquity;

    const createGame = await tradedGameModel.create({
      userId: session.user._id,
      gameId: foundGame._id,
      isGameTraded: true,
      eventOneStats: {
        totalEquity: eventOneTotalEquity.toFixed(2),
        expectedReturns: eventOneExpectedReturns.toFixed(2),
        eventRoi: eventOneRoi.toFixed(2),
      },
      eventTwoStats: {
        totalEquity: eventTwoTotalEquity.toFixed(2),
        expectedReturns: eventTwoExpectedReturns.toFixed(2),
        eventRoi: eventTwoRoi.toFixed(2),
      },
    });

    foundUserWallet.accountBalance -= foundUserWallet.equity;
    await foundUserWallet.save();

    return res.status(200).json({ message: 'Trade made successfully' });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

export const cancelGame = async (req, res) => {};

export const getGame = async (req, res) => {
  try {
    const session = await getSession({ req });

    const gameId = req.query.gameId;

    if (!session) {
      return res.status(401).send('you are not authenticated');
    }
    // const foundGame = await gameModel.findById(gameId);

    const findGame = await tradedGameModel
      .find({
        userId: session.user._id,
        gameId: gameId,
      })
      .select('-gameId -userId -__v -_id -createdAt -updatedAt');

    if (findGame.length === 0) {
      return res.status(200).json({ message: [] });
    } else {
      return res.status(200).json({ message: findGame });
    }
  } catch (error) {
    console.log(error.message);
    return res.status(400).json({ message: error.message });
  }
};
