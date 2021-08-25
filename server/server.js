const express = require('express');
const path = require('path');
const db = require('./config/connection');
const routes = require('./routes');
const { typeDefs, resolvers } = require('./schemas');
const { ApolloServer } = require('apollo-server-express');
const app = express();
const PORT = process.env.PORT || 3001;
const { authMiddleware } = require('./utils/auth');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
    context: authMiddleware,
    fetchOptions: {
      mode: 'no-cors',
    },
});

apolloServer.applyMiddleware({ app });

// if we're in production, serve client/build as static assets
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}

app.use(routes);


db.once('open', () => {
  app.listen(PORT, () => console.log(`🌍 Now listening on localhost:${PORT}`));
  
});
