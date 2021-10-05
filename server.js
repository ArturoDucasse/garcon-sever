import { ApolloServer } from "apollo-server-express";
import AdminBroExpress from "@admin-bro/express";
import AdminBroMongoose from "@admin-bro/mongoose";
import { ApolloServerPluginDrainHttpServer } from "apollo-server-core";
import express from "express";
import AdminBro from "admin-bro";
import mongoose from "mongoose";
import http from "http";
import session from "express-session";

import Menu from "./services/MongoDB/models/menu.js";
import MenuItem from "./services/MongoDB/models/menuItem.js";
import Order from "./services/MongoDB/models/order.js";
import Restaurant from "./services/MongoDB/models/restaurant.js";

import typeDefs from "./graphql/typeDefs.js";
import resolvers from "./graphql/resolvers.js";

AdminBro.registerAdapter(AdminBroMongoose);

import MongoDBStore from "connect-mongodb-session";

const connectMongo = MongoDBStore(session);

var store = new connectMongo({
  uri: "mongodb+srv://r2d2:3muCWbiTQe5gavkV@garcon-cluster0.0bjta.mongodb.net/garcon?retryWrites=true&w=majority",
  collection: "sessions"
});

const port = 3000;

const database = await mongoose.connect(
  "mongodb+srv://r2d2:3muCWbiTQe5gavkV@garcon-cluster0.0bjta.mongodb.net/garcon?retryWrites=true&w=majority",
  { useNewUrlParser: true }
);

const adminBro = new AdminBro({
  databases: [database],
  resources: [Menu, MenuItem, Order, Restaurant],
  rootPath: "/admin"
});
const router = AdminBroExpress.buildRouter(adminBro);

async function startApolloServer(typeDefs, resolvers) {
  const app = express();
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
  const httpServer = http.createServer(app);
  const { ObjectId } = mongoose.Types;

  ObjectId.prototype.valueOf = function () {
    return this.toString();
  };
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
    context: ({ req }) => req
  });
  await server.start();
  server.applyMiddleware({ app });
  app.use(adminBro.options.rootPath, router);
  await new Promise((resolve) => httpServer.listen({ port }, resolve));
  console.log(
    `🚀 Server ready at http://localhost:${port}${server.graphqlPath}`
  );
}

startApolloServer(typeDefs, resolvers);
