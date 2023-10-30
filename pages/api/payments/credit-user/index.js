import crypto from 'crypto';
import db from '../../../../utils/db';
import accountHistoryModel from '../../../../models/accountHistory';
import walletProfileModel from '../../../../models/walletProfile';

export default async (req, res) => {
  if (req.method === 'POST') {
    return verifyPaymentViaWebhook(req, res);
  } else {
    return res.status(400).send({ message: 'Method not allowed' });
  }
};

export const verifyPaymentViaWebhook = async (req, res) => {
  try {
    await db.connect();

    const foundOrder = await accountHistoryModel.findOne({
      transactionIdForAdmin: req.body.payment_id,
      transactionId: req.body.order_id,
    });

    // Validate the event is from NowPayment
    let hash = crypto
      .createHmac('sha512', `${process.env.NOWPAYMENT_IPN_SECRET_KEY}`)
      .update(JSON.stringify(req.body, Object.keys(req.body).sort()))
      .digest('hex');

    if (hash === req.headers['x-nowpayments-sig']) {
      res.status(200).send('Ok');
      console.log('this nigga ran');

      if (
        foundOrder.paymentStatus === 'pending' &&
        req.body.actually_paid === req.body.price_amount &&
        req.body.payment_status === 'finished'
      ) {
        //! update payment status
        foundOrder.paymentStatus = 'completed';
        foundOrder.amountPaidByUser = req.body.actually_paid;
        foundOrder.amountReceived = req.body.outcome_amount;

        await foundOrder.save();

        //! increase balance and roi
        const updateOne = {
          $inc: {
            accountBalance: req.body.actually_paid,
            equity: req.body.actually_paid,
          },
        };

        await walletProfileModel.findOneAndUpdate(
          { userId: foundOrder.userId },
          updateOne
        );

        console.log('value was given');
        res.status(200).send('Ok');
      }
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};
