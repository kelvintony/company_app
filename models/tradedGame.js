import mongoose from 'mongoose';
import gameModel from './game';

const tradedGameSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
    gameId: { type: mongoose.Schema.Types.ObjectId, ref: gameModel },
    isGameTraded: { type: Boolean, default: false },
    isUserTradeProcessed: { type: Boolean, default: false },
    concludedEvent: { type: String },
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
