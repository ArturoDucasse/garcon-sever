"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const apollo_server_express_1 = require("apollo-server-express");
const typeDefs = (0, apollo_server_express_1.gql) `
  type Restaurant {
    #Add instagram?
    name: String
    description: String
    menus: [Menu]
  }

  type Menu {
    name: String!
    menuItems: [MenuItem]!
  }

  type MenuItem {
    _id: String
    name: String!
    description: String
    price: Float!
    imageUrl: String
  }

  type Query {
    getRestaurant(id: String!): Restaurant
  }

  type Mutation {
    createOrder(ordersArray: [ID]): String
    updateOrder: String
    deleteOrder: String
  }
`;
exports.default = typeDefs;
