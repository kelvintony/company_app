import { getSession } from 'next-auth/react';
import { getToken } from 'next-auth/jwt';

import db from '../../../utils/db';
import { v4 as uuidv4 } from 'uuid';
import accountHistoryModel from '../../../models/accountHistory';
import paymentStatusModel from '../../../models/paymentStatus';

// const apiUrl = 'https://api.nowpayments.io/v1/payment';
const apiUrl = 'https://api.nowpayments.io/v1/payment';

const headers = {
  'x-api-key': `${process.env.NOWPAYMENT_API_KEY}`,
  'Content-Type': 'application/json',
};

export default async (req, res) => {
  if (req.method === 'POST') {
    return createPayment(req, res);
  } else if (req.method === 'GET') {
    return verifyPayment(req, res);
  } else {
    return res.status(400).json({ message: 'Method not allowed' });
  }
};

export const createPayment = async (req, res) => {
  try {
    await db.connect();

    const session = await getSession({ req });

    // if (!session) {
    //   return res.status(401).json({ message: 'you are not authenticated' });
    // }

    const data = {
      price_amount: req.body.amount,
      price_currency: 'usd',
      pay_currency: 'usdttrc20',
      pay_amount: req.body.amount,
      order_id: uuidv4(),
      order_description: 'Wallet funding',
      ipn_callback_url: `${process.env.IPN_CALL_BACK_URL}`,
      // is_fixed_rate: true,
    };

    if (req.body.amount < 10) {
      return res
        .status(409)
        .json({ message: 'amount must not be less than $10' });
    }
    const response = await fetch(apiUrl, {
      method: 'POST',
      maxBodyLength: Infinity,
      headers,
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const dk = await response.json();
      return res.status(409).json({ message: dk.message });
    } else {
      const responseData = await response.json();

      //! create Payment Order
      await accountHistoryModel.create({
        // userId: session.user._id,
        userId: '65424f6e2fc788baf01ebc49',
        paymentStatus: 'pending',
        amount: responseData.price_amount,
        whatFor: responseData.order_description,
        transactionId: responseData.order_id,
        transactionIdForAdmin: responseData.payment_id,
        payAddress: responseData.pay_address,
        payAmount: responseData.pay_amount,
      });

      //! create Status Report
      await paymentStatusModel.create({
        // userId: session.user._id,
        userId: '65424f6e2fc788baf01ebc49',
        transactionId: responseData.order_id,
        transactionIdForAdmin: responseData.payment_id,
        amount: responseData.price_amount,
      });

      const formattedResponse = {
        payment_id: responseData.payment_id,
        pay_address: responseData.pay_address,
        price_amount: responseData.price_amount,
        pay_amount: responseData.pay_amount,
        order_id: responseData.order_id,
      };
      // return res.status(200).json({ message: responseData });
      return res.status(200).json({ message: formattedResponse });
    }
  } catch (error) {
    console.log(error.message);
    return res.status(400).json({ message: error.message });
  }
};

export const verifyPayment = async (req, res) => {
  try {
    const session = await getSession({ req });

    const paymentId = req.query.paymentId;

    // if (!session) {
    //   return res.status(401).send('you are not authenticated');
    // }
    // const foundGame = await gameModel.findById(gameId);

    const response = await fetch(`${apiUrl}/${paymentId}`, {
      method: 'GET',
      maxBodyLength: Infinity,
      headers,
    });

    if (!response.ok) {
      const dk = await response.json();
      return res.status(409).json({ message: dk.message });
    } else {
      const responseData = await response.json();
      return res.status(200).json({ message: responseData });
    }
  } catch (error) {
    console.log(error.message);
    return res.status(400).json({ message: error.message });
  }
};
