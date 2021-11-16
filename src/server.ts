import http from "http";
import express from "express";
import { Server } from "socket.io";
import session from "express-session";
import MongoStore from "connect-mongo";

import mongodb from "./mongo/connection";
import apolloServer from "./services/apollo/startApolloServer";
import admin from "./services/adminBro/startAdminBro";
import Restaurant from "./mongo/models/restaurant";
import Menu from "./mongo/models/menu";
import MenuItems from "./mongo/models/menuItem";

const app = express();
const httpServer = http.createServer(app);
const io = new Server(httpServer);

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
  await mongodb();

  app.use(adminBro.options.rootPath, router);

  io.on("connection", (socket) => {
    console.log("a user connected");
    socket.on("order", (order) => {
      socket.to("restaurant").emit(order);
    });
  });

  app.get("/:restaurantId/:tableId", async (req, res, next) => {
    try {
      const data = req.params;

      req.session.data = data;

      const restaurant = await Restaurant.findById(data.restaurantId).populate({
        path: "menus",
        model: Menu,
        populate: { path: "menuItems", model: MenuItems }
      });

      if (!restaurant) throw new Error("Restaurant not found");

      res.json(restaurant).status(200);
    } catch (error) {
      next(error);
    }
  });

  await server.start();
  server.applyMiddleware({ app });
  await new Promise<void>((resolve) =>
    httpServer.listen({ port: 3000 }, resolve)
  );

  console.log(`🚀 Server ready at http://localhost:3000${server.graphqlPath}`);
  console.log(`🚀 Admin view ready at http://localhost:3000/admin`);
};

startServer();
