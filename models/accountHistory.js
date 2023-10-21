import mongoose from 'mongoose';

const accountHistorySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'user',
    },
    paymentStatus: { type: String, default: 'pending' },
    amount: { type: Number },
    whatFor: { type: String },
    transactionId: { type: String },
    transactionIdForAdmin: { type: String },
  },
  {
    timestamps: true,
  }
);

const accountHistory =
  mongoose.models.accountHistory ||
  mongoose.model('accountHistory', accountHistorySchema);

export default accountHistory;
