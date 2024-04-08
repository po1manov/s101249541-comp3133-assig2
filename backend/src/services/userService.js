const User = require('../models/User');

const getUserById = async (userId) => {
    try {
        const user = await User.findById(userId);
        if (!user) {
            throw new Error('User not found.');
        }
        return user;
    } catch (error) {
        throw new Error(`Failed to fetch user: ${error.message}`);
    }
};

const updateUser = async (userId, userData) => {
    try {
        const user = await User.findByIdAndUpdate(userId, userData, { new: true });
        if (!user) {
            throw new Error('User not found.');
        }
        return user;
    } catch (error) {
        throw new Error(`Failed to update user: ${error.message}`);
    }
};

const deleteUser = async (userId) => {
    try {
        const deletedUser = await User.findByIdAndDelete(userId);
        if (!deletedUser) {
            throw new Error('User not found.');
        }
        return { success: true, message: 'User deleted successfully.' };
    } catch (error) {
        throw new Error(`Failed to delete user: ${error.message}`);
    }
};

module.exports = {
    getUserById,
    updateUser,
    deleteUser,
};
