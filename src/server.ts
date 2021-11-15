import express from "express";
import session from "express-session";
import MongoStore from "connect-mongo";
import http from "http";

import apolloServer from "./services/apollo/startApolloServer";
import admin from "./services/adminBro/startAdminBro";

const app = express();
const httpServer = http.createServer(app);

app.use(
  session({
    secret: "foo",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl:
        "mongodb+srv://r2d2:3muCWbiTQe5gavkV@garcon-cluster0.0bjta.mongodb.net/garcon?retryWrites=true&w=majority",
      dbName: "garcon",
      collectionName: "sessions",
      stringify: false
    })
  })
);

const startServer = async () => {
  const server = await apolloServer(httpServer);
  const [adminBro, router] = await admin();

  app.use(adminBro.options.rootPath, router);

  await server.start();
  server.applyMiddleware({ app });
  await new Promise<void>((resolve) =>
    httpServer.listen({ port: 3000 }, resolve)
  );
  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`);
};

startServer();
