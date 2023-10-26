import mongoose from 'mongoose';
import user from './user';

const accountHistorySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: user,
    },
    paymentStatus: { type: String, default: 'pending' },
    amount: { type: Number, float: true },
    whatFor: { type: String },
    transactionId: { type: String },
    transactionIdForAdmin: { type: String },
    amountPaidByUser: { type: String },
    payAddress: { type: String },
    payAmount: { type: Number, float: true },
    amountReceived: { type: Number, float: true },
  },
  {
    timestamps: true,
  }
);

const accountHistory =
  mongoose.models.accountHistory ||
  mongoose.model('accountHistory', accountHistorySchema);

export default accountHistory;
