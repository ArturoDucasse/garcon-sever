import AdminBroExpress from "@admin-bro/express";
import AdminBro from "admin-bro";
import AdminBroMongoose from "@admin-bro/mongoose";

import database from "../MongoDB/connection.js";

//models
import Menu from "../MongoDB/models/menu.js";
import MenuItem from "../MongoDB/models/menuItem.js";
import Order from "../MongoDB/models/order.js";
import Restaurant from "../MongoDB/models/restaurant.js";

AdminBro.registerAdapter(AdminBroMongoose);

export const adminBro = new AdminBro({
  databases: [database],
  resources: [Menu, MenuItem, Order, Restaurant],
  rootPath: "/admin"
});

const router = AdminBroExpress.buildRouter(adminBro);

export default router;
