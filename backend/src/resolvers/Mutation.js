const User = require('../models/User');
const Employee = require('../models/Employee');
const bcrypt = require('bcryptjs');

const mutationResolvers = {
    signup: async (_, { username, email, password }) => {
        try {
            const userExists = await User.findOne({ $or: [{ username }, { email }] });
            if (userExists) {
                throw new Error('Username or email already exists');
            }

            const newUser = new User({
                username,
                email,
                password,
            });

            const savedUser = await newUser.save();

            return {
                _id: savedUser._id,
                username: savedUser.username,
                email: savedUser.email,
            };
        } catch (error) {
            throw new Error(`Signup failed: ${error.message}`);
        }
    },

    addNewEmployee: async (_, { first_name, last_name, email, gender, salary }) => {
        try {
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

            const savedEmployee = await newEmployee.save();

            return savedEmployee;
        } catch (error) {
            throw new Error(`Adding new employee failed: ${error.message}`);
        }
    },

    updateEmployee: async (_, { eid, first_name, last_name, email, gender, salary }) => {
        try {
            const employee = await Employee.findById(eid);
            if (!employee) {
                throw new Error(`Employee with id ${eid} not found`);
            }

            employee.first_name = first_name || employee.first_name;
            employee.last_name = last_name || employee.last_name;
            employee.email = email || employee.email;
            employee.gender = gender || employee.gender;
            employee.salary = salary || employee.salary;

            const updatedEmployee = await employee.save();

            return updatedEmployee;
        } catch (error) {
            throw new Error(`Updating employee failed: ${error.message}`);
        }
    },

    deleteEmployee: async (_, { eid }) => {
        try {
            const deletedEmployee = await Employee.findByIdAndDelete(eid);
            if (!deletedEmployee) {
                throw new Error(`Employee with id ${eid} not found`);
            }
            
            return {
                success: true,
                message: `Employee with id ${eid} was deleted successfully`,
            };
        } catch (error) {
            throw new Error(`Deleting employee failed: ${error.message}`);
        }
    },
};

module.exports = mutationResolvers;
