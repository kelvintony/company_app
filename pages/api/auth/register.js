import bcryptjs from 'bcryptjs';
import userModel from '../../../models/user';
import db from '../../../utils/db';

async function handler(req, res) {
  if (req.method !== 'POST') {
    return;
  }
  const {
    firstName,
    lastName,
    walletAddress,
    email,
    password,
    confirmPassword,
  } = req.body;
  if (
    !firstName ||
    !lastName ||
    !email ||
    !email.includes('@') ||
    !password ||
    !walletAddress
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
      walletAddress,
      email,
      password: bcryptjs.hashSync(password),
      superUser: false,
    });

    return res.status(201).send({
      message: 'User created, check email to verify your account',
    });
  } catch (error) {
    return res.status(409).json({ message: error.message });
  }
}

export default handler;
