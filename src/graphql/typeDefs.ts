import { Types } from "mongoose";
import { gql } from "apollo-server-express";

export type CreateOrderInput = {
  restaurantId: string; //TODO: Delete this field, value will be generated from the req.session
  tableId: number; //Todo: Delete
  order: [{ productId: Types.ObjectId; quantity: number }];
  note: string;
  userId: string; //Todo: Delete as well, will be generated from the req.session
};

export type UpdateOrderInput = {
  userId: String;
  order: [MenuItemInput];
};

export type CloseOrderInput = {
  userId: String;
  restaurantId: String;
  orderItems?: [{ productId: Types.ObjectId; quantity: number }];
  tableId: number;
};

interface MenuItemInput {
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

  input MenuItemInput {
    _id: String!
    name: String
    description: String
    price: Float
    imageUrl: String
    tableId: Int
    quantity: Int!
  }

  type MenuItem {
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
    order: [MenuItem]
    userId: String
    note: String
  }

  # User model

  type User {
    userId: String
    populatedOrder: [MenuItem]
    tableId: Int
  }

  # Query input

  input GetUsersInTableInput {
    tableId: Int
    restaurantId: String
  }

  type Query {
    getUserDetails(userId: ID): User
    getMenuItem(menuItemId: ID): MenuItem
    getUsersInTable(input: GetUsersInTableInput): [User]
    getAllActiveUsers(restaurantId: String): [User]
  }

  #Mutations input

  input UpdateOrderInput {
    userId: String
    order: [MenuItemInput]
  }

  input Temp { #Rename this
    productId: String
    quantity: Int
  }

  input CreateOrderInput {
    restaurantId: String
    tableId: Int!
    order: [Temp]
    note: String
    userId: String
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
    closeAllOrdersInTableAndSave(input: CloseOrderInput): String
    closeAllOrdersInTable(input: CloseOrderInput): String
  }

  # Subscription result
  type OrderStatus {
    status: String
    update: OrderUpdate
    userId: String
  }

  type OrderUpdate {
    order: [MenuItem]
  }

  type Subscription {
    orderCreation(restaurantId: ID!): CreateOrder
    orderStatus(userId: ID!): OrderStatus
  }
`;

export default typeDefs;
