import mongoose from 'mongoose';
import user from './user';

const paymentStatusSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: user },
    transactionId: { type: String },
    transactionIdForAdmin: { type: String },
    amount: { type: Number, float: true },
    amountPaidByUser: { type: Number, float: true, default: 0 },
    paymentStatus: [
      {
        status: { type: String },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const paymentStatus =
  mongoose.models.paymentStatus ||
  mongoose.model('paymentStatus', paymentStatusSchema);

export default paymentStatus;
