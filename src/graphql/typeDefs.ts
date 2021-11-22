import { Types } from "mongoose";
import { gql } from "apollo-server-express";

export type CreateOrderInput = {
  restaurantId: string; //TODO: Delete this field, value will be generated from the req.session
  tableId: number; //Todo: Delete
  order: [{ productId: Types.ObjectId; quantity: number }];
  userId: string; //Todo: Delete as well, will be generated from the req.session
};

export type UpdateOrderInput = {
  userId: String;
  order: [ItemMenuInput];
};

export type CloseOrderInput = {
  userId: String;
  restaurantId: String;
  orderItems?: [{ productId: Types.ObjectId; quantity: number }];
  tableId: number;
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
  # Item menu model

  input ItemMenuInput {
    _id: String!
    name: String
    description: String
    price: Float
    imageUrl: String
    tableId: Int
    quantity: Int!
  }

  type ItemMenu {
    _id: String
    name: String
    description: String
    price: Float
    imageUrl: String
    tableId: Int
    quantity: Int
  }

  # Order model

  type CreateOrder {
    restaurantId: String
    tableId: Int
    order: [ItemMenu]
    userId: String
  }

  # User model

  type User {
    userId: String
    order: [ItemMenu]
    tableId: Int
  }

  # Query input

  input GetUsersInTableInput {
    tableId: Int
    restaurantId: Int
  }

  type Query {
    getUserDetails(userId: ID): User
    getUsersInTable(input: GetUsersInTableInput): [User]
    getAllActiveUsers(restaurantId: String): [User]
  }

  #Mutations input

  input UpdateOrderInput {
    userId: String
    order: [ItemMenuInput]
  }

  input Temp { #Rename this
    productId: String
    quantity: Int
  }

  input CreateOrderInput {
    restaurantId: String
    tableId: Int!
    order: [Temp]
  }

  input CloseOrderInput {
    userId: String
    restaurantId: String
    orderItems: [OrderInput]
    tableId: Int
  }

  input OrderInput {
    productId: String
    quantity: Int
  }

  type Mutation {
    createOrder(input: CreateOrderInput): String
    orderComplete(userId: ID): String
    updateOrder(input: UpdateOrderInput): String
    closeOrder(input: CloseOrderInput): String
    closeOrderAndSave(input: CloseOrderInput): String
  }

  # Subscription result
  type OrderStatus {
    status: String
    update: OrderUpdate
    userId: String
  }

  type OrderUpdate {
    order: [ItemMenu]
  }

  type Subscription {
    orderCreated(restaurantId: ID!): CreateOrder
    orderStatus(userId: ID!): OrderStatus
  }
`;

export default typeDefs;
