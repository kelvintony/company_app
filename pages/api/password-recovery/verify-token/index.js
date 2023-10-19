import db from '../../../../utils/db';
import userModel from '../../../../models/user';
import Token from '../../../../models/token';
import bcryptjs from 'bcryptjs';

export default async (req, res) => {
  await db.connect();

  switch (req.method) {
    case 'POST':
      await verifyPasswordLink(req, res);
      break;

    default:
      res.status(409).json({ message: 'method does not exist' });
  }
};

export const verifyPasswordLink = async (req, res) => {
  const userid = req.query.userid;
  const token = req.query.token;

  const { password, confirmPassword } = req.body;

  try {
    const user = await userModel.findOne({ _id: userid });

    if (!user) return res.status(400).json({ message: 'User does not exist' });

    if (password !== confirmPassword)
      return res.status(400).json({ message: 'Password must match' });

    const orderToken = await Token.findOne({
      userId: userid,
      token: token,
    });

    if (!orderToken) {
      return res.status(400).json({ message: 'token does not exist' });
    }

    if (password === confirmPassword) {
      const hashedPassword = await bcryptjs.hashSync(password);

      user.password = hashedPassword;

      await user.save();

      await orderToken.deleteOne();

      res.status(200).json({ message: 'password reset successful' });
    }
  } catch (error) {
    res.status(500).json({ message: 'something went wrong' });
    console.log(error.message);
  }
};
