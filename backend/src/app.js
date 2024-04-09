require('dotenv').config();

const express = require('express');
const { ApolloServer, AuthenticationError } = require('apollo-server-express');
const jwt = require('jsonwebtoken');

const schema = require('./schema/index');

const getTokenFromHeaders = (req) => {
  const authorization = req.headers.authorization || '';
  const match = authorization.match(/^Bearer (.+)$/);
  return match ? match[1] : null;
};

const getUserFromToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    switch (error.name) {
      case 'TokenExpiredError':
        throw new AuthenticationError('Your token is expired');
      case 'JsonWebTokenError':
        throw new AuthenticationError('Invalid token');
      default:
        throw new Error('Authentication token error');
    }
  }
};

const app = express();

app.use(express.json());

const server = new ApolloServer({
  schema,
  context: async ({ req }) => {
    const token = getTokenFromHeaders(req);
    let user = null;
    if (token) {
      try {
        user = getUserFromToken(token);
      } catch (e) {
        console.warn(`Unable to authenticate using auth token: ${token}`);
      }
    }
    return { user };
  },
});

server.applyMiddleware({ app });

module.exports = app;
