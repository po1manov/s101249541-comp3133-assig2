const User = require('../models/User');
const Employee = require('../models/Employee');
const bcrypt = require('bcryptjs');
const { isAuthenticated, generateToken } = require('../services/authService');

const mutationResolvers = {
  signup: async (_, { username, email, password }) => {
    const userExists = await User.findOne({ $or: [{ username }, { email }] });
    if (userExists) {
      throw new Error('Username or email already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    const savedUser = await newUser.save();

    const token = generateToken(savedUser._id);

    return {
      token,
      user: {
        _id: savedUser._id,
        username: savedUser.username,
        email: savedUser.email
      }
    };
  },

  addNewEmployee: async (_, { first_name, last_name, email, gender, salary }, context) => {
    isAuthenticated(context);

    const employeeExists = await Employee.findOne({ email });
    if (employeeExists) {
      throw new Error('An employee with this email already exists');
    }

    const newEmployee = new Employee({
      first_name,
      last_name,
      email,
      gender,
      salary,
    });

    return await newEmployee.save();
  },

  updateEmployee: async (_, { eid, first_name, last_name, email, gender, salary }, context) => {
    isAuthenticated(context);

    const employee = await Employee.findById(eid);
    if (!employee) {
      throw new Error(`Employee with id ${eid} not found`);
    }

    employee.first_name = first_name || employee.first_name;
    employee.last_name = last_name || employee.last_name;
    employee.email = email || employee.email;
    employee.gender = gender || employee.gender;
    employee.salary = salary !== undefined ? salary : employee.salary;

    return await employee.save();
  },

  deleteEmployee: async (_, { eid }, context) => {
    isAuthenticated(context);

    const deletedEmployee = await Employee.findByIdAndDelete(eid);
    if (!deletedEmployee) {
      throw new Error(`Employee with id ${eid} not found`);
    }

    return {
      success: true,
      message: `Employee with id ${eid} was deleted successfully`,
    };
  },
};

module.exports = mutationResolvers;
