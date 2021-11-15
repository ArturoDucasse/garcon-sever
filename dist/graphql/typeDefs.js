"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const apollo_server_express_1 = require("apollo-server-express");
const typeDefs = (0, apollo_server_express_1.gql) `
  type Restaurant {
    name: String
    description: String
    menus: [Menu]
  }

  type Menu {
    name: String
    menuItems: [MenuItem]
  }

  type MenuItem {
    name: String
    description: String
    price: Float
    imageUrl: String
  }

  type Order {
    orderItems: [ID]
    totalAmount: Int
    tableId: Int
    restaurantId: String
  }

  type Query {
    getRestaurant(id: String!): Restaurant
    test: String
    test2: String
  }

  type Mutation {
    createOrder(ordersArray: [ID]): String
    updateOrder: String
    deleteOrder: String
  }
`;
exports.default = typeDefs;
