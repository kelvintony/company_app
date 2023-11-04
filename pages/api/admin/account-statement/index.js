import { getSession } from 'next-auth/react';
import { getToken } from 'next-auth/jwt';

import db from '../../../../utils/db';
import accountStatementModel from '../../../../models/accountStatement';

export default async (req, res) => {
  if (req.method === 'GET') {
    return getAccountInformation(req, res);
  } else {
    return res.status(400).send({ message: 'Method not allowed' });
  }
};

export const getAccountInformation = async (req, res) => {
  const session = await getSession({ req });

  if (!session || (session && !session.user.superUser)) {
    return res.status(401).send('you are not authenticated');
  }

  try {
    await db.connect();

    const foundDocument = await accountStatementModel
      .find({})
      .select('-updatedAt -__v -createdAt -_id');

    const totalAmountReceivedAfterFee = foundDocument.reduce(
      (total, document) => total + document.totalAmountReceivedAfterFee,
      0
    );

    const totalAmountPaidOut = foundDocument.reduce(
      (total, document) => total + document.totalAmountPaidOut,
      0
    );
    const totalProfit = totalAmountReceivedAfterFee - totalAmountPaidOut;

    const formattedDocument = {
      totalAmountReceived: foundDocument[0].totalAmountReceived,
      totalAmountReceivedAfterFee: foundDocument[0].totalAmountReceivedAfterFee,
      totalAmountPaidOut: foundDocument[0].totalAmountPaidOut,
      totalProfit,
    };

    return res.status(200).json({ message: formattedDocument });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};
