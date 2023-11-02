import mongoose from 'mongoose';
import user from './user';

const referralSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: user },
    referralId: { type: String, trim: true, lowercase: true },
    referredUsers: [
      {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: user },
        isUserBonusAdded: { type: Boolean, default: false },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const referral =
  mongoose.models.referral || mongoose.model('referral', referralSchema);

export default referral;
