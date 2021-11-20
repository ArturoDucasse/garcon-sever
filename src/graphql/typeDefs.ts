import { Types } from "mongoose";
import { gql } from "apollo-server-express";

export type OrderInput = {
  restaurantId: string; //TODO: Delete this field, value will be generated from the req.session
  tableId: number; //Todo: Delete
  order: [Types.ObjectId];
  userId: string; //Todo: Delete as well, will be generated from the req.session
};

export type UpdateOrderInput = {
  userId: String;
  order: [ItemMenuInput];
};

interface ItemMenuInput {
  _id: Types.ObjectId;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  tableId: number;
  quantity: number;
}

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
    _id: ID
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
    userId: String
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
    getUser(userId: ID): User
    getUsersInTable(input: GetUsersInTableInput): [User]
  }

  type Mutation {
    createOrder(input: CreateOrderInput): String
    orderComplete(userId: ID): String
    updateOrder(input: UpdateOrderInput): String
    closeOrderAndSave(userId: ID): String
    closeOrder(userId: ID): String
    closeAllOrdersInTable(restaurantId: String, tableId: Int): String
  }

  input UpdateOrderInput {
    userId: String
    order: [ItemMenuInput]
  }

  type OrderStatus {
    status: String
    update: OrderUpdate
    userId: String
  }

  type OrderUpdate {
    order: [ItemMenu]
  }

  type Subscription {
    orderCreated(restaurantId: ID!): Order
    orderStatus(userId: ID!): OrderStatus
  }
`;

export default typeDefs;
