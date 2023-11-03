import mongoose from 'mongoose';

const accountStatementSchema = new mongoose.Schema(
  {
    totalAmountReceived: { type: Number, float: true, default: 0 },
    totalAmountReceivedAfterFee: { type: Number, float: true, default: 0 },
    totalAmountPaidOut: { type: Number, float: true, default: 0 },
  },
  {
    timestamps: true,
  }
);

const accountStatement =
  mongoose.models.accountStatement ||
  mongoose.model('accountStatement', accountStatementSchema);

export default accountStatement;
