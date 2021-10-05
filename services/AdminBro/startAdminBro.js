import AdminBroExpress from "@admin-bro/express";
import AdminBro from "admin-bro";
import AdminBroMongoose from "@admin-bro/mongoose";

import database from "../mongoDB/connection.js";

//models
import Menu from "../mongoDB/models/menu.js";
import MenuItem from "../mongoDB/models/menuItem.js";
import Order from "../mongoDB/models/order.js";
import Restaurant from "../mongoDB/models/restaurant.js";

AdminBro.registerAdapter(AdminBroMongoose);

export const adminBro = new AdminBro({
  databases: [database],
  resources: [Menu, MenuItem, Order, Restaurant],
  rootPath: "/admin"
});

const router = AdminBroExpress.buildRouter(adminBro);

export default router;
