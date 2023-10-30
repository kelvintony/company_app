import mongoose from 'mongoose';
import user from './user';

const referralSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: user },
    referralId: { type: String },
    referredUsers: [
      {
        userId: { type: String, default: 'none' },
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
