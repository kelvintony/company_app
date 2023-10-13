import mongoose from 'mongoose';

const tradedGameSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
    gameId: { type: mongoose.Schema.Types.ObjectId, ref: 'game' },
    isGameTraded: { type: Boolean, default: false },
    eventOneStats: {
      totalEquity: {
        type: mongoose.Schema.Types.Decimal128,
        default: 0,
      },
      expectedReturns: {
        type: mongoose.Schema.Types.Decimal128,
        default: 0,
      },
      eventRoi: {
        type: mongoose.Schema.Types.Decimal128,
        default: 0,
      },
    },
    eventTwoStats: {
      totalEquity: {
        type: mongoose.Schema.Types.Decimal128,
        default: 0,
      },
      expectedReturns: {
        type: mongoose.Schema.Types.Decimal128,
        default: 0,
      },
      eventRoi: {
        type: mongoose.Schema.Types.Decimal128,
        default: 0,
      },
    },
  },
  {
    timestamps: true,
  }
);

const tradedGame =
  mongoose.models.tradedGame || mongoose.model('tradedGame', tradedGameSchema);

export default tradedGame;
