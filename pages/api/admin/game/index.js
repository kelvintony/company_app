import { getSession } from 'next-auth/react';
import { getToken } from 'next-auth/jwt';

import db from '../../../../utils/db';
import gameModel from '../../../../models/game';

const handler = async (req, res) => {
  if (req.method === 'POST') {
    return createGame(req, res);
  } else if (req.method === 'GET') {
    return getGame(req, res);
  } else {
    return res.status(400).send({ message: 'Method not allowed' });
  }
};

const createGame = async (req, res) => {
  await db.connect();

  try {
    const {
      eventType,
      eventSelection,
      eventOption1,
      eventOption1Odd,
      eventOption2,
      eventOption2Odd,
      eventDate,
      eventTime,
      eventDateWithoutFormat,
    } = req.body;

    const session = await getSession({ req });

    if (!session || (session && !session.user.superUser)) {
      return res.status(401).send({ message: 'you are not authenticated' });
    }

    if (
      !eventType ||
      !eventSelection ||
      !eventOption1 ||
      !eventOption1Odd ||
      !eventOption2 ||
      !eventOption2Odd ||
      !eventDate ||
      !eventTime ||
      !eventDateWithoutFormat
    ) {
      return res.status(401).send({ message: 'one of the field is empty' });
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
      eventDateWithoutFormat,
    });

    return res.status(200).json({ message: 'game created' });
  } catch (error) {
    console.log(error.message);
    return res.status(400).json({ message: error.message });
  }
};

const getGame = async (req, res) => {
  await db.connect();

  const session = await getSession({ req });

  if (!session) {
    return res.status(401).send({ message: 'you are not authenticated' });
  }

  try {
    const latestDocument = await gameModel.find({}).sort({ _id: -1 }).limit(1);

    return res.status(200).json({ message: latestDocument[0] });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

export default handler;
