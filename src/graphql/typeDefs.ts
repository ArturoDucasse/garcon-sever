import { Types } from "mongoose";
import { gql } from "apollo-server-express";

export type OrderInput = {
  restaurantId: string; //TODO: Delete this field, value will be generated from the req.session
  tableId: number;
  order: [Types.ObjectId];
};

export enum OrderStage {
  COMPLETE = "Complete",
  UPDATE = "Update",
  DELETE = "Delete"
}

const typeDefs = gql`
  input CreateOrderInput {
    restaurantId: String
    tableId: Int!
    order: [String]
  }

  input ItemMenuInput {
    name: String
    description: String
    price: Float
    imageUrl: String
    tableId: Int
    quantity: Int
  }

  type ItemMenu {
    name: String
    description: String
    price: Float
    imageUrl: String
    tableId: Int
    quantity: Int
  }

  type Order {
    restaurantId: String
    tableId: Int
    order: [ItemMenu]
    sessionId: String
  }

  type User {
    order: [ItemMenu]
    table: Int
  }

  input GetUsersInTableInput {
    tableId: Int
    restaurantId: Int
  }

  type Query {
    getUser(sessionId: ID): User
    getUsersInTable(input: GetUsersInTableInput): [User]
  }

  type Mutation {
    createOrder(input: CreateOrderInput): String
    orderComplete(sessionId: ID): String
    updateOrder(input: UpdateOrderInput): String
    closeOrder(sessionId: ID): String
  }

  input UpdateOrderInput {
    sessionId: String
    order: [ItemMenuInput]
  }

  type OrderStatus {
    isComplete: Boolean
    update: OrderUpdate
    sessionId: String
  }

  type OrderUpdate {
    order: [ItemMenu]
  }

  type Subscription {
    orderCreated(restaurantId: ID!): Order
    orderStatus(sessionId: ID!): OrderStatus
  }
`;

export default typeDefs;
