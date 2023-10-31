import mongoose from 'mongoose';
import user from './user';

const walletProfileSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: user },
    accountBalance: { type: mongoose.Schema.Types.Decimal128, default: 0 },
    equity: { type: mongoose.Schema.Types.Decimal128, default: 0 },
    roi: { type: mongoose.Schema.Types.Decimal128, default: 0 },
    withdrawableBalance: { type: mongoose.Schema.Types.Decimal128, default: 0 },
    referralBonus: { type: mongoose.Schema.Types.Decimal128, default: 0 },
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
