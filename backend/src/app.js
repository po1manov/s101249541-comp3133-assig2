const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const mongoose = require('mongoose');

const typeDefs = require('./schema/typeDefs');
const resolvers = require('./resolvers');
const schema = require('./schema');

// Connect to MongoDB
mongoose.connect('mongodb+srv://pojmanovg:AiYMa92qYCf6G3Dg@comp3133assignment1.5p6byeu.mongodb.net/', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
    console.log('Connected to MongoDB');
});

// Create an Express application
const app = express();

// Set up Apollo Server
const server = new ApolloServer({
    schema,
    context: ({ req }) => {
        // You can add context logic here, such as authentication middleware
        // For example, you might decode JWT tokens and attach user information to the context
        return {
            // Add context properties here
        };
    },
});

// Start Apollo Server
server.start().then(() => {
    server.applyMiddleware({ app });
});

app.get('/', (req, res) => {
    res.send('Hello World!');
});

module.exports = app;
