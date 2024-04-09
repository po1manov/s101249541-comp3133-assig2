const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = '1d';

const generateToken = (userId) => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

const registerUser = async (userData) => {
  const { username, email, password } = userData;

  const existingUser = await User.findOne({ $or: [{ username }, { email }] });
  if (existingUser) {
    throw new Error('User already exists with the given username or email.');
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = new User({
    username,
    email,
    password: hashedPassword,
  });

  const savedUser = await user.save();

  const token = generateToken(savedUser._id);

  return {
    token,
    user: {
      _id: savedUser._id,
      username: savedUser.username,
      email: savedUser.email
    }
  };
};

const authenticateUser = async (usernameOrEmail, password) => {
  const user = await User.findOne({
    $or: [{ username: usernameOrEmail }, { email: usernameOrEmail }]
  }).select('+password');

  if (!user) {
    throw new Error('User not found.');
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error('Invalid password.');
  }

  const token = generateToken(user._id);

  return {
    token,
    user: {
      _id: user._id,
      username: user.username,
      email: user.email
    }
  };
};

module.exports = {
  registerUser,
  authenticateUser,
  generateToken,
};
