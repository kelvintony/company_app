import { getSession } from 'next-auth/react';
import { getToken } from 'next-auth/jwt';
import gameModel from '../../../../models/game';
import db from '../../../../utils/db';
import tradedGameModel from '../../../../models/tradedGame';

export default async (req, res) => {
  if (req.method === 'GET') {
    return getAllGames(req, res);
  } else {
    return res.status(400).send({ message: 'Method not allowed' });
  }
};

export const getAllGames = async (req, res) => {
  const session = await getSession({ req });

  if (!session) {
    return res.status(401).send('you are not authenticated');
  }

  try {
    await db.connect();

    const latestDocument = await tradedGameModel
      .find({ userId: session.user._id })
      .sort({ _id: -1 })
      .populate({
        path: 'gameId',
        select: 'eventSelection eventDate eventTime _id',
        model: gameModel,
      })
      .select('-updatedAt -eventOneStats -eventTwoStats')
      .lean();

    // const latestDocument = await tradedGameModel
    //   .find({ userId: session.user._id })
    //   .populate('gameId');

    // const docArray = latestDocument.map(({ _doc }) => _doc);

    // console.log('my array', docArray);

    // const filteredDocument = {
    //   _id: latestDocument?._id,
    //   eventSelection: latestDocument?.eventSelection,
    //   eventDate: latestDocument?.gameId?.eventDate,
    //   eventTime: latestDocument?.gameId?.eventTime,
    //   isUserTradeProcessed: latestDocument?.isUserTradeProcessed,
    //   createdAt: latestDocument?.createdAt,
    // };

    // console.log(filteredDocument);
    return res.status(200).json({ message: latestDocument });
  } catch (error) {
    console.log(error.message);
    return res.status(400).json({ message: error.message });
  }
};
