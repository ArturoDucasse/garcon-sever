"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const apollo_server_express_1 = require("apollo-server-express");
const typeDefs = (0, apollo_server_express_1.gql)`
  input OrderInput {
    tableId: Int!
    order: [String]
  }

  type Order {
    sessionId: String
    tableId: Int
    orderItems: [ID]
    restaurantId: String
  }

  type Query {
    test: String
  }

  type Mutation {
    createOrder(input: OrderInput): String
  }

  type Subscription {
    order: Int
  }
`;
exports.default = typeDefs;
