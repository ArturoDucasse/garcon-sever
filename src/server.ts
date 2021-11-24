import http from "http";
import express from "express";
import session from "express-session";
import MongoStore from "connect-mongo";
import { SubscriptionServer } from "subscriptions-transport-ws";
import { execute, subscribe } from "graphql";

import apolloServer from "./services/apollo/startApolloServer";
import admin from "./services/adminBro/startAdminBro";
import { getRestaurant } from "./controllers/restaurant";

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
  const [apollo, schema] = await apolloServer(httpServer);
  const [adminBro, router] = await admin();

  app.use(adminBro.options.rootPath, router);

  app.get("/:restaurantId/:tableId", getRestaurant);

  await apollo.start();
  apollo.applyMiddleware({ app });

  SubscriptionServer.create(
    { schema, execute, subscribe },
    { server: httpServer, path: apollo.graphqlPath }
  );

  await new Promise<void>((resolve) =>
    httpServer.listen({ port: 3000 }, resolve)
  );

  console.log(`🚀 Server ready at http://localhost:3000${apollo.graphqlPath}`);
  console.log(`🚀 Admin view ready at http://localhost:3000/admin`);
};

startServer();
