const User = require('../models/User');
const bcrypt = require('bcryptjs');

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

    const { password: _, ...userWithoutPassword } = savedUser.toObject();
    return userWithoutPassword;
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

    const { password: _, ...userWithoutPassword } = user.toObject();
    return userWithoutPassword;
};

module.exports = {
    registerUser,
    authenticateUser,
};
