const User = require('../models/User');
const Employee = require('../models/Employee');

const queryResolvers = {
    login: async (_, { username, password }) => {
        const user = await User.findOne({ $or: [{ username }, { email: username }] }).select('+password');
        if (!user) {
            throw new Error('User not found');
        }

        const valid = await user.comparePassword(password);
        if (!valid) {
            throw new Error('Invalid password');
        }

        return { user }; 
    },

    employees: async () => {
        try {
            const employees = await Employee.find({});
            return employees;
        } catch (error) {
            throw new Error(`Fetching employees failed: ${error.message}`);
        }
    },

    employee: async (_, { eid }) => {
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