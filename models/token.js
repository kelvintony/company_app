import mongoose from 'mongoose';
import user from './user';

const tokenSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: user,
  },
  token: { type: String },
  createdAt: { type: Date, default: Date.now() }, // 1 hour
});

const token = mongoose.models.token || mongoose.model('token', tokenSchema);

export default token;
