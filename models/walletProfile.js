import mongoose from 'mongoose';

const walletProfileSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
    accountBalance: { type: mongoose.Schema.Types.Decimal128, default: 0 },
    // accountType: { type: String, default: 'customer' },
  },
  {
    timestamps: true,
  }
);

const walletProfile =
  mongoose.models.walletProfile ||
  mongoose.model('walletProfile', walletProfileSchema);

export default walletProfile;
