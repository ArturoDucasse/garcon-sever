import express from "express";
import session from "express-session";
import MongoDBStore from "connect-mongodb-session";
import http from "http";

import apolloServer from "./services/apollo/startApolloServer";
import admin from "./services/adminBro/startAdminBro";

const app = express();
const httpServer = http.createServer(app);

const connectMongo = MongoDBStore(session);

var store = new connectMongo({
  uri: "mongodb+srv://r2d2:3muCWbiTQe5gavkV@garcon-cluster0.0bjta.mongodb.net/garcon?retryWrites=true&w=majority",
  collection: "sessions"
});

app.use(
  session({
    secret: "This is a secret",
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7 // 1 week
    },
    store: store,
    resave: false,
    saveUninitialized: false
  })
);

const startServer = async () => {
  const server = await apolloServer(httpServer);
  const [adminBro, router] = await admin();

  app.use(adminBro.options.rootPath, router);

  await server.start();
  server.applyMiddleware({ app });
  await new Promise<void>((resolve) =>
    httpServer.listen({ port: 4000 }, resolve)
  );
  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`);
};

startServer();
