const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type Query {
    login(identifier: String!, password: String!): AuthPayload
    employees: [Employee]
    employee(eid: ID!): Employee
  }

  type Mutation {
    signup(username: String!, email: String!, password: String!): AuthPayload
    addNewEmployee(first_name: String!, last_name: String!, email: String!, gender: Gender!, salary: Float!): Employee
    updateEmployee(eid: ID!, first_name: String, last_name: String, email: String, gender: Gender, salary: Float): Employee
    deleteEmployee(eid: ID!): DeletePayload
  }

  type User {
    _id: ID!
    username: String!
    email: String!
  }

  type Employee {
    _id: ID!
    first_name: String!
    last_name: String!
    email: String!
    gender: Gender!
    salary: Float!
  }

  type AuthPayload {
    token: String
    user: User
  }

  type DeletePayload {
    success: Boolean!
    message: String!
  }

  enum Gender {
    Male
    Female
    Other
  }
`;

module.exports = typeDefs;
