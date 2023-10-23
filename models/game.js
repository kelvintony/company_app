import mongoose from 'mongoose';
import user from './user';

const gameSchema = new mongoose.Schema(
  {
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: user,
    },
    eventType: { type: String },
    eventSelection: { type: String },
    eventOption1: { type: String },
    eventOption1Odd: { type: mongoose.Schema.Types.Decimal128 },
    eventOption2: { type: String },
    eventOption2Odd: { type: mongoose.Schema.Types.Decimal128 },
    eventDate: { type: String },
    eventDateWithoutFormat: { type: String },
    eventTime: { type: String },
    status: {
      type: Object,
      default: { locked: true },
    },
    eventMode: { type: String, default: 'pending' },
    concludedEvent: { type: String },
    gameDescription: { type: String, default: 'not latest' },
  },
  {
    timestamps: true,
  }
);

const game = mongoose.models.game || mongoose.model('game', gameSchema);

export default game;
