import { getSession } from 'next-auth/react';
import { getToken } from 'next-auth/jwt';

import db from '../../../../../utils/db';
import tradedGameModel from '../../../../../models/tradedGame';
import walletProfileModel from '../../../../../models/walletProfile';

import { Decimal128 } from 'mongodb';
const concludeUserTradePassword = process.env.CONCLUDE_USER_TRADE_PASSWORD;

const handler = async (req, res) => {
  if (req.method === 'PUT') {
    return processUserTrade(req, res);
  } else if (req.method === 'GET') {
    return getSingleGameTradedByUser(req, res);
  } else {
    return res.status(400).send({ message: 'Method not allowed' });
  }
};

const processUserTrade = async (req, res) => {
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

    // if (password !== concludeUserTradePassword) {
    //   return res.status(401).json({ message: 'Password is incorrect' });
    // }

    if (!concludeTrade) {
      return res
        .status(401)
        .json({ message: 'kindly check the complete trade' });
    }

    const foundUserWallet = await walletProfileModel.findOne({
      userId: userId,
    });

    const foundTradedGame = await tradedGameModel.findById(gameId);

    if (!foundTradedGame) {
      return res.status(401).json({ message: 'Game does not exist' });
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

const getSingleGameTradedByUser = async (req, res) => {
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

export default handler;
/*
const updateEquityWithRoi = (
  existingValueInDecimal128,
  ordinaryValueToAddInNumber
) => {
  // first convert both value to Decimal128
  const existingValue = Decimal128.fromString(
    existingValueInDecimal128.toString()
  );
  const valueToAdd = Decimal128.fromString(
    ordinaryValueToAddInNumber.toString()
  );

  //second, add the number to avoid and multiply by 1 to avoid NaN
  const numericResult =
    existingValue.toString() * 1 + valueToAdd.toString() * 1;

  //optional - i rounded up to two decimal places
  const roundedResult = parseFloat(numericResult.toFixed(2));

  //lastly Convert the total value back to Decimal128 and return
  return Decimal128.fromString(roundedResult.toString());
};

const newEquity = updateEquityWithRoi(foundUserWallet.equity, eventOneRoi);

foundUserWallet.equity = newEquity;

await foundUserWallet.save();
*/
