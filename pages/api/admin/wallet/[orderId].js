import { getSession } from 'next-auth/react';
import { getToken } from 'next-auth/jwt';

import db from '../../../../utils/db';
import accountHistoryModel from '../../../../models/accountHistory';

import walletProfileModel from '../../../../models/walletProfile';
import accountStatementModel from '../../../../models/accountStatement';

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

    const { password, concludeTrade } = req.body;

    const orderId = req.query.orderId;

    if (password !== concludeUserTradePassword) {
      return res.status(401).json({ message: 'Password is incorrect' });
    }

    // if (!concludeTrade) {
    //   return res
    //     .status(401)
    //     .json({ message: 'kindly check the conclude order' });
    // }

    const foundOrder = await accountHistoryModel.findById(orderId);

    if (!foundOrder) {
      return res.status(401).json({ message: 'Order does not exist' });
    }

    if (foundOrder.paymentStatus === 'completed') {
      return res.status(401).json({ message: 'Order already settled' });
    }

    await accountHistoryModel.findByIdAndUpdate(
      orderId,
      {
        paymentStatus: 'completed',
      },
      { new: true }
    );

    //! Update Admin Account Information
    const updateAccountDetails = {
      $inc: {
        totalAmountPaidOut: foundOrder.amount,
      },
    };
    await accountStatementModel.updateMany({}, updateAccountDetails);

    return res.status(200).json({ message: 'Order completed' });
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
