/** configuration */
const config = require('./utils/config');
const logger = require('./utils/logger');

/** express */
const { createServer } = require('http');
const express = require('express');

/** graphQL */
const {
  ApolloServerPluginDrainHttpServer,
  ApolloServerPluginLandingPageLocalDefault,
} = require('apollo-server-core');
const { makeExecutableSchema } = require('@graphql-tools/schema');
const { WebSocketServer } = require('ws');
const { useServer } = require('graphql-ws/lib/use/ws');
const { ApolloServer } = require('apollo-server-express');

/** mongoose */
const mongoose = require('mongoose');

/** Mongoose models */
const User = require('./models/user');
const jwt = require('jsonwebtoken');

/** GraphQL schemas */
const { typeDefs, resolvers } = require('./schema');

logger.info('connecting to', config.MONGODB_URI);
mongoose
  .connect(config.MONGODB_URI)
  .then(() => {
    logger.info('connected to MongoDB');
  })
  .catch((error) => {
    logger.error('error connecting to MongoDB:', error.message);
  });
mongoose.set('debug', true);

const start = async () => {
  const app = express();
  const httpServer = createServer(app);

  /** web socket can parse schema only */
  const schema = makeExecutableSchema({ typeDefs, resolvers });

  /** web socket server */
  const wsServer = new WebSocketServer({
    // This is the `httpServer` we created in a previous step.
    server: httpServer,
    // Pass a different path here if your ApolloServer serves at
    // a different path.
    path: '', // graphql
  });

  // Hand in the schema we just created and have the
  // WebSocketServer start listening.
  const serverCleanup = useServer({ schema }, wsServer);

  const server = new ApolloServer({
    schema,
    context: async ({ req }) => {
      const auth = req ? req.headers.authorization : null;
      if (auth && auth.toLowerCase().startsWith('bearer ')) {
        const decodedToken = jwt.verify(auth.substring(7), config.JWT_SECRET);
        const currentUser = await User.findById(decodedToken.id);
        return { currentUser };
      }
    },
    csrfPrevention: true,
    cache: 'bounded',
    plugins: [
      // Proper shutdown for the HTTP server.
      ApolloServerPluginDrainHttpServer({ httpServer }),

      // Proper shutdown for the WebSocket server.
      {
        async serverWillStart() {
          return {
            async drainServer() {
              await serverCleanup.dispose();
            },
          };
        },
      },
      ApolloServerPluginLandingPageLocalDefault({ embed: true }),
    ],
  });

  await server.start();

  server.applyMiddleware({
    app,
    path: '/',
  });

  const PORT = 4000;

  httpServer.listen(PORT, () =>
    console.log(`Server is now running on http://localhost:${PORT}`)
  );
};

// const server = new ApolloServer({
//   typeDefs, // typeDefs could be an array of multiple typeDef
//   resolvers,
//   context: async ({ req }) => {
//     const auth = req ? req.headers.authorization : null;
//     if (auth && auth.toLowerCase().startsWith('bearer ')) {
//       const decodedToken = jwt.verify(auth.substring(7), config.JWT_SECRET);
//       const currentUser = await User.findById(decodedToken.id);
//       return { currentUser };
//     }
//   },
// });

// call the function that does the setup and starts the server
start();
