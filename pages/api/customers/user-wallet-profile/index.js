import walletProfileModel from '../../../../models/walletProfile';
import { getSession } from 'next-auth/react';
import db from '../../../../utils/db';

export default async (req, res) => {
  if (req.method === 'GET') {
    return fetchUser(req, res);
  } else {
    return res.status(400).send({ message: 'Method not allowed' });
  }
};

export const fetchUser = async (req, res) => {
  const session = await getSession({ req });

  const userProfile = session.user;

  if (!session) {
    return res.status(401).send('you are not authenticated');
  }

  try {
    await db.connect();

    let foundUser = await walletProfileModel.findOne({
      userId: userProfile._id,
    });

    return res.status(200).json(foundUser);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
