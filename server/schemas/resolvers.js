const { AuthenticationError } = require('apollo-server-express');
const { User } = require('../models');
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
    async login(parent, {username, email, password}) {
      //Find User based on credentials 
      console.log("resolve login");

      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: "Can't find this user" });
      }
      //Check with hook
      const correctPw = await user.isCorrectPassword(password);
      if (!correctPw) {
        return res.status(400).json({ message: 'Wrong password!' });
      }
      //Auth 
      const token = signToken(user);
      return { token, user };
    },
    async addUser(parent , arg) {
      //Find a user based on the input
      console.log("resolve addUser");

      const user = await User.create(arg);
      const token = signToken(user);
      return { token, user };
    },
    async saveBook({ user, body }, res) {
      console.log("resolve saveBook");

      console.log(user);
      try {
        //Tries to find the user and append the book to the array
        const updatedUser = await User.findOneAndUpdate(
          { _id: user._id },
          { $addToSet: { savedBooks: body } },
          { new: true, runValidators: true }
        );
        //Returns the updated user
        return updatedUser;
      } 
      catch (err) {
        console.log(err);
        return res.status(400).json(err);
      }
    },
    async removeBook({ user, params }, res) {
      //Find User and remove last book from array
      console.log("resolve removeBook");

      const updatedUser = await User.findOneAndUpdate(
        { _id: user._id },
        { $pull: { savedBooks: { bookId: params.bookId } } },
        { new: true }
      );
      //Checks if User exists
      if (!updatedUser) {
        return res.status(404).json({ message: "Couldn't find user with this id!" });
      }
      //Return Updated User
      return updatedUser;
    },
  }
};

module.exports = resolvers;
