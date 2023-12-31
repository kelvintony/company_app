import { getSession } from 'next-auth/react';
import { getToken } from 'next-auth/jwt';

import db from '../../../../../utils/db';
import accountHistoryModel from '../../../../../models/accountHistory';

const handler = async (req, res) => {
  if (req.method === 'GET') {
    return getAccountHistory(req, res);
  } else if (req.method === 'POST') {
    return getSingleTransaction(req, res);
  } else {
    return res.status(400).send({ message: 'Method not allowed' });
  }
};

const getAccountHistory = async (req, res) => {
  const session = await getSession({ req });

  if (!session) {
    return res.status(401).send('you are not authenticated');
  }

  try {
    await db.connect();

    const latestDocument = await accountHistoryModel
      .find({ userId: session.user._id })
      .sort({ _id: -1 })
      .select('-updatedAt -transactionIdForAdmin');

    return res.status(200).json({ message: latestDocument });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

const getSingleTransaction = async (req, res) => {
  const session = await getSession({ req });

  if (!session) {
    return res.status(401).send('you are not authenticated');
  }

  try {
    await db.connect();

    const latestDocument = await accountHistoryModel
      .findById(req.body.transactionId)

      .select('-updatedAt -transactionIdForAdmin');

    return res.status(200).json({ message: latestDocument });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

export default handler;
