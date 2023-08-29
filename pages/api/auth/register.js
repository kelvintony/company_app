import bcryptjs from 'bcryptjs';
import userModel from '../../../models/user';
import db from '../../../utils/db';
import transactionProfileModel from '../../../models/transactionProfile';
import { createVirtualAccount } from '../monnify/create-customer/index';

async function handler(req, res) {
  if (req.method !== 'POST') {
    return;
  }
  const { firstName, lastName, phoneNumber, email, password, confirmPassword } =
    req.body;
  if (
    !firstName ||
    !lastName ||
    !email ||
    !email.includes('@') ||
    !password ||
    !phoneNumber
  ) {
    return res.status(409).json({
      message: 'Validation error',
    });
  }

  try {
    await db.connect();

    const existingUser = await userModel.findOne({ email: email });

    if (existingUser) {
      return res.status(409).json({ message: 'User already exists!' });
    }

    if (password !== confirmPassword) {
      return res.status(409).json({
        message: 'Password must match',
      });
    }

    // const hashedPassword = await bcryptjs.hash(password, 12);

    const newUser = await userModel.create({
      firstName,
      lastName,
      fullName: `${firstName} ${lastName}`,
      phoneNumber,
      email,
      password: bcryptjs.hashSync(password),
      superUser: false,
    });

    const newUserTransactionProfile = await transactionProfileModel.create({
      userId: newUser?._id,
    });

    //generate user Virtual Account
    if (newUser) {
      const data = {
        accountName: newUser?.firstName,
        accountReference: newUser?._id,
        customerName: newUser?.phoneNumber,
        customerEmail: newUser?.email,
      };

      let accountResponse = await createVirtualAccount(data);
      // console.log(accountResponse);
      if (accountResponse !== 200) {
        throw new Error(`internal server error!, could not create account`);
      }

      return res.status(201).send({
        message: 'user Created!',
      });
    }
  } catch (error) {
    return res.status(409).json({ message: error.message });
  }
}

export default handler;
