import { Types } from "mongoose";
import http from "http";
import express from "express";
import session from "express-session";
import MongoStore from "connect-mongo";
import { SubscriptionServer } from "subscriptions-transport-ws";
import { execute, subscribe } from "graphql";

import Session from "./mongo/models/session";
import apolloServer from "./services/apollo/startApolloServer";
import admin from "./services/adminBro/startAdminBro";
import Restaurant from "./mongo/models/restaurant";
import Menu from "./mongo/models/menu";
import MenuItems from "./mongo/models/menuItem";

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
  const test = await Session.find();

  console.log(test, "testing");

  app.use(adminBro.options.rootPath, router);

  app.get("/:restaurantId/:tableId", async (req, res, next) => {
    try {
      const params = req.params;

      req.session.restaurantId =
        params.restaurantId as unknown as Types.ObjectId;
      req.session.tableId = +params.tableId;

      const restaurant = await Restaurant.findById(
        params.restaurantId
      ).populate({
        path: "menus",
        model: Menu,
        populate: { path: "menuItems", model: MenuItems }
      });

      if (!restaurant) throw new Error("Restaurant not found");

      res.json(restaurant).status(200);
    } catch (error: any) {
      // next(error); Create error handler
      res.status(404).json({ success: false, error: error.message });
    }
  });

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
