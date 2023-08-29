import { getSession } from 'next-auth/react';
import { getToken } from 'next-auth/jwt';

import db from '../../../../utils/db';
import orderModel from '../../../../models/order';

const userName = `${process.env.VTU_USERNAME}`;
const userPassword = `${process.env.VTU_PASSWORD}`;

export default async (req, res) => {
  await db.connect();

  if (req.method === 'GET') {
    return fetchWalletBalance(req, res);
  } else {
    return res.status(400).send({ message: 'Method not allowed' });
  }
};

const fetchWalletBalance = async (req, res) => {
  try {
    // const user = await getToken({ req });
    const user = await getToken({
      req,
      secret: process.env.NEXTAUTH_SECRET,
    });
    if (!user || (user && !user.superUser)) {
      return res.status(401).send('signin required');
    }

    const response = await fetch(
      `https://vtu.ng/wp-json/api/v1/balance?username=${userName}&password=${userPassword}`
    );

    const getBalance = await response.json();

    return res.status(200).json({ message: getBalance });
  } catch (error) {
    return res.status(400).json({ message: 'something went wrong' });
  }
};
