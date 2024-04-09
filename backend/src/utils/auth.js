const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.JWT_SECRET;

const isAuthenticated = (context) => {
  if (!context.user) {
    throw new Error('You must be logged in to perform this action.');
  }
};


module.exports = {
  isAuthenticated,
};
