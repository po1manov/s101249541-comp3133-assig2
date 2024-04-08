const validateEmail = (email) => {
    const regex = /.+\@.+\..+/;
    return regex.test(email);
};

const validateString = (str, minLength = 1) => {
    return typeof str === 'string' && str.trim().length >= minLength;
};


const validatePassword = (password) => {
    return validateString(password, 6); 
};


const validateSalary = (salary) => {
    return typeof salary === 'number' && salary >= 0;
};

const validateGender = (gender) => {
    const validGenders = ['Male', 'Female', 'Other'];
    return validGenders.includes(gender);
};

module.exports = {
    validateEmail,
    validateString,
    validatePassword,
    validateSalary,
    validateGender,
};