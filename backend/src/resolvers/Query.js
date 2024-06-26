const User = require('../models/User');
const Employee = require('../models/Employee');
const { isAuthenticated } = require('../utils/auth');
const { generateToken } = require("../services/authService");

const queryResolvers = {
  login: async (_, { username, password }) => {
    const user = await User.findOne({ username }).select('+password');
    if (!user) {
      throw new Error('User not found');
    }

    const valid = await user.comparePassword(password);
    if (!valid) {
      throw new Error('Invalid password');
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
  },

  employees: async (_, args, context) => {
    isAuthenticated(context);
    try {
      const employees = await Employee.find({});
      return employees;
    } catch (error) {
      throw new Error(`Fetching employees failed: ${error.message}`);
    }
  },

  employee: async (_, { eid }, context) => {
    isAuthenticated(context);
    try {
      const employee = await Employee.findById(eid);
      if (!employee) {
        throw new Error(`Employee with id ${eid} not found`);
      }
      return employee;
    } catch (error) {
      throw new Error(`Fetching employee failed: ${error.message}`);
    }
  }
};

module.exports = queryResolvers;
