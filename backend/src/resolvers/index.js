const queryResolvers = require('./Query');
const mutationResolvers = require('./Mutation');

const resolvers = {
    Query: queryResolvers,
    Mutation: mutationResolvers,
};

module.exports = resolvers;
