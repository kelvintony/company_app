import { getSession } from 'next-auth/react';
import { getToken } from 'next-auth/jwt';

import db from '../../../../utils/db';
import gameModel from '../../../../models/game';

export default async (req, res) => {
  if (req.method === 'POST') {
    return createGame(req, res);
  } else if (req.method === 'GET') {
    return getGame(req, res);
  } else {
    return res.status(400).send({ message: 'Method not allowed' });
  }
};

export const createGame = async (req, res) => {
  await db.connect();

  try {
    // const user = await getToken({
    //   req,
    //   secret: process.env.NEXTAUTH_SECRET,
    // });

    // if (!user || (user && !user.superUser)) {
    //   return res.status(401).send('signin required');
    // }
    const {
      eventType,
      eventSelection,
      eventOption1,
      eventOption1Odd,
      eventOption2,
      eventOption2Odd,
      eventDate,
      eventTime,
    } = req.body;

    const session = await getSession({ req });

    if (!session || (session && !session.user.superUser)) {
      return res.status(401).send('you are not authenticated');
    }

    await gameModel.create({
      createdBy: session.user._id,
      eventType,
      eventSelection,
      eventOption1,
      eventOption1Odd,
      eventOption2,
      eventOption2Odd,
      eventDate,
      eventTime,
    });

    return res.status(200).json({ message: 'game created' });
  } catch (error) {
    console.log(error.message);
    return res.status(400).json({ message: error.message });
  }
};

export const getGame = async (req, res) => {
  await db.connect();

  const session = await getSession({ req });

  if (!session || (session && !session.user.superUser)) {
    return res.status(401).send('you are not authenticated');
  }

  try {
    const latestDocument = await gameModel
      .find({})
      .sort({ createdAt: -1 }) // Replace 'timestampField' with the field that represents the document's order (e.g., 'createdAt')
      .limit(1);

    return res.status(200).json({ message: latestDocument[0] });
  } catch (error) {
    console.log(error.message);
    return res.status(400).json({ message: error.message });
  }
};
