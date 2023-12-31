import crypto from 'crypto';
import db from '../../../../utils/db';
import accountHistoryModel from '../../../../models/accountHistory';
import walletProfileModel from '../../../../models/walletProfile';
import referralModel from '../../../../models/referral';
import paymentStatusModel from '../../../../models/paymentStatus';
import accountStatementModel from '../../../../models/accountStatement';

const handler = async (req, res) => {
  if (req.method === 'POST') {
    return verifyPaymentViaWebhook(req, res);
  } else {
    return res.status(400).send({ message: 'Method not allowed' });
  }
};

const verifyPaymentViaWebhook = async (req, res) => {
  try {
    await db.connect();

    // const account = new accountStatementModel();
    // account.totalAmountReceived = 0;
    // account.totalAmountPaidOut = 0;
    // account.totalAmountReceivedAfterFee = 0;
    // await account.save();

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
      //! update extra payment status
      const foundPaymentStatus = await paymentStatusModel.findOne({
        transactionIdForAdmin: req.body.payment_id,
        transactionId: req.body.order_id,
      });

      foundPaymentStatus.amountPaidByUser = req.body.actually_paid;
      foundPaymentStatus.paymentStatus.push({
        status: req.body.payment_status,
      });
      await foundPaymentStatus.save();
      //
      //
      if (
        foundOrder.paymentStatus === 'pending' &&
        (req.body.payment_status === 'finished' ||
          req.body.payment_status === 'partially_paid')
      ) {
        //! update payment status
        foundOrder.paymentStatus = 'completed';
        foundOrder.amountPaidByUser = req.body.actually_paid;
        foundOrder.amountReceived = req.body.outcome_amount;

        await foundOrder.save();

        //! increase balance and equity
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

        //! Give referral bonus and update
        const foundReferral = await referralModel.findOne({
          'referredUsers.userId': foundOrder.userId,
        });

        for (const referral of foundReferral.referredUsers) {
          if (
            referral.userId.toString() === foundOrder.userId.toString() &&
            referral.isUserBonusAdded === false
          ) {
            referral.isUserBonusAdded = true;
            await foundReferral.save();

            //* give 5% of the money paid to the upliner
            const userReferralUpdateDetails = {
              $inc: {
                referralBonus: (req.body.actually_paid * 5) / 100,
              },
            };

            await walletProfileModel.findOneAndUpdate(
              { userId: foundReferral.userId },
              userReferralUpdateDetails
            );

            console.log('this place ran');
            break; // If you found the user, you can exit the loop early.
          }
        }

        //! Update Admin Account Information
        const updateAccountDetails = {
          $inc: {
            totalAmountReceived: req.body.actually_paid,
            totalAmountReceivedAfterFee: req.body.outcome_amount,
          },
        };
        await accountStatementModel.updateMany({}, updateAccountDetails);

        console.log('value was given');
      }

      // res.status(200).send('Ok');
      // console.log('header was confirmed');
    }
    //
    //! remove this when
    res.status(200).send('Ok');
    console.log('hook ran');
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

export default handler;
