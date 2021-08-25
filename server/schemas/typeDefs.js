const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type User {
    _id: ID
    username: String
    email: String
    bookCount: String
    savedBooks: [Book]!
  }

  type Book {
    bookid: ID
    authors: String
    description: String
    title: String
    image: String
    link: String
  }

  type Auth {
    token: ID!
    profile: User
  }

  type Query {
     me: User
  }

  type Mutation {
    login(email: String!, password: String!): Auth
    addUser(username: String!, email: String!, password: String!): Auth
    saveBook: User
    removeBook(bookId: String!): User 
  }
`;

module.exports = typeDefs;
