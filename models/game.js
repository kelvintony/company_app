import mongoose from 'mongoose';

const gameSchema = new mongoose.Schema(
  {
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'user',
    },
    eventType: { type: String },
    eventSelection: { type: String },
    eventOption1: { type: String },
    eventOption1Odd: { type: Number },
    eventOption2: { type: String },
    eventOption2Odd: { type: Number },
    eventDate: { type: String },
    eventTime: { type: String },
    status: {
      type: Object,
      default: { locked: true },
    },
    eventMode: { type: String, default: 'pending' },
    concludedEvent: { type: String },
  },
  {
    timestamps: true,
  }
);

const game = mongoose.models.game || mongoose.model('game', gameSchema);

export default game;
