const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({

    first_name: {
        type: String,
        required: [true, 'First name is required'],
        trim: true,
    },

    last_name: {
        type: String,
        required: [true, 'Last name is required'],
        trim: true,
    },

    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        trim: true,
        lowercase: true, 
        match: [/.+\@.+\..+/, 'Please fill a valid email address'], 
    },

    gender: {
        type: String,
        required: [true, 'Gender is required'],
        enum: {
            values: ['Male', 'Female', 'Other'],
            message: '{VALUE} is not supported',
        },
    },

    salary: {
        type: Number,
        required: [true, 'Salary is required'],
        validate: {
            validator: function(v) {
                return v >= 0;
            },
            message: props => `${props.value} is not a valid salary amount. Salary must be non-negative.`,
        },
    },
}, {
    timestamps: true, 
});

const Employee = mongoose.model('Employee', employeeSchema);

module.exports = Employee;
