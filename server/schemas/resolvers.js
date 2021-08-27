const { AuthenticationError } = require('apollo-server-express');
const { User, Book } = require('../models');
const { signToken } = require('../utils/auth');

const resolvers = {
  Query: {
    me: async (parent, args, context) => {
      if (context.user) {
        return User.findOne({ _id: context.user._id });
      }
      throw new AuthenticationError('You need to be logged in!');
    },
  },

  Mutation: {
    async login(parent, {email, password}, context) {
      //Find User based on credentials 
      console.log("resolve login");

      const user = await User.findOne({ email });
      if (!user) {
        throw new AuthenticationError('No user found with this email address');
      }
      //Check with hook
      const correctPw = await user.isCorrectPassword(password);
      if (!correctPw) {
        throw new AuthenticationError('PassWord Error');
      }
      //Auth 
      const token = signToken(user);

      return { token, user };
    },
    async addUser(parent , { username, email, password }) {
      //Find a user based on the input
      console.log("resolve addUser");

      const user = await User.create({ username, email, password });
      const token = signToken(user);
      return { token, user };
    },
    async saveBook(parent, { newBook }, context) {

      console.log("resolve saveBook");

      if (context.user) {
        //Tries to find the user and append the book to the array
        const updatedUser = await User.findOneAndUpdate(
          { _id: context.user._id },
          { $push: { savedBooks: newBook } },
          { 
            new: true,
            runValidators: true 
          }
        );
        //Returns the updated user
        return updatedUser;
      } 
      else {
        throw new AuthenticationError('SaveBook Error');
      }
    },
    async removeBook(parent, { bookId }, context) {
      //Find User and remove last book from array
      console.log("resolve removeBook");
      console.log({bookId});

      if (context.user) {
        //Tries to find the user and append the book to the array
        const updatedUser = await User.findOneAndUpdate(
          { _id: context.user._id },
          { $pull: { savedBooks: {bookId} } },
          { 
            new: true,
            runValidators: true 
          }
        );
        //Returns the updated user
        return updatedUser;
      } 
      else {
        throw new AuthenticationError('SaveBook Error');
      }
    },
  }
};

module.exports = resolvers;
