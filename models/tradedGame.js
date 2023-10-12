import mongoose from 'mongoose';

const tradedGameSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
    gameId: { type: mongoose.Schema.Types.ObjectId, ref: 'game' },
    isGameTraded: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

const tradedGame =
  mongoose.models.tradedGame || mongoose.model('tradedGame', tradedGameSchema);

export default tradedGame;
