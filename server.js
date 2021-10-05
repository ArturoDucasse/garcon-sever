import express from "express";
import session from "express-session";
import MongoDBStore from "connect-mongodb-session";

import router, { adminBro } from "./services/adminBro/startAdminBro.js";
import startApolloServer from "./services/apolloServer/startApolloServer.js";

const app = express();

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

app.use(adminBro.options.rootPath, router);

startApolloServer(app);
