import mongoose from 'mongoose';
import user from './user';

const orderSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: user },
    reference: { type: String },
    referenceIdForAdmin: { type: String },
    email: { type: String },
    amount: { type: Number },
    phoneNumber: { type: String },
    paid: { type: String, default: 'pending' },
    status: { type: String, default: 'pending' },
    whatFor: { type: String },
    updateType: { type: String },
    selectedNetwork: { type: String },
  },
  {
    timestamps: true,
  }
);

const order = mongoose.models.order || mongoose.model('order', orderSchema);

export default order;
