import db from '../../../utils/db';
import userModel from '../../../models/user';
import tokenModel from '../../../models/token';

export default async (req, res) => {
  await db.connect();

  switch (req.method) {
    case 'GET':
      await verifyConfirmationLink(req, res);
      break;

    default:
      res.status(409).json({ message: 'method does not exist' });
  }
};

export const verifyConfirmationLink = async (req, res) => {
  const userid = req.query.userid;
  const token = req.query.token;

  try {
    const orderToken = await tokenModel.findOne({
      userId: userid,
      token: token,
    });

    const user = await userModel.findById({ _id: userid });

    if (!orderToken) {
      return res.status(400).json({ message: 'token does not exist' });
    }

    if (!user) {
      return res.status(400).json({ message: 'user does not exist' });
    }

    user.verified = true;

    await user.save();

    // await orderToken.remove();

    res.status(200).json({ message: 'Account verification was successful' });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
};
