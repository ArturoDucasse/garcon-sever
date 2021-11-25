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

export type CloseSingleOrderInput = {
  userId: String;
  restaurantId: String;
};

export type CloseSingleOrderAndSaveInput = {
  userId: string;
  restaurantId: string;
};

export type CloseTableOrdersInput = {
  tableId: number;
  restaurantId: string;
};

export type CloseTableOrdersAndSaveInput = {
  tableId: number;
  restaurantId: string;
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
    """
    This query returns the user order details
    """
    getUserDetails(userId: ID): User
    """
    This query returns the menu item details
    """
    getMenuItem(menuItemId: ID): MenuItem
    """
    This query returns all users details in one particular table
    """
    getUsersInTable(input: GetUsersInTableInput): [User]
    """
    This query returns all active users(sessions) in the restaurant
    """
    getAllActiveUsers(restaurantId: String): [User]
  }

  #Mutations input

  input UpdateOrderInput {
    userId: String
    order: [MenuItemInput]
  }

  input OrderInput {
    productId: String
    quantity: Int
  }

  input CreateOrderInput {
    restaurantId: String
    tableId: Int!
    order: [OrderInput]
    note: String
    userId: String
  }

  input CloseSingleOrderInput {
    userId: String
    restaurantId: String
  }

  input CloseSingleOrderAndSaveInput {
    userId: String
    restaurantId: String
  }

  input CloseTableOrdersAndSaveInput {
    tableId: Int
    restaurantId: String
  }

  input CloseTableOrdersInput {
    tableId: Int
    restaurantId: String
  }

  type Mutation {
    """
    This mutation creates an order, and sends a message to the <orderStatus> subscription.
    """
    createOrder(input: CreateOrderInput): String
    """
    This mutation sends a message to the <orderStatus> notifying that the order is complete.
    """
    orderComplete(userId: ID): String
    """
    This mutation updates an existing order.
    """
    updateOrder(input: UpdateOrderInput): String
    """
    This mutation closes/deletes an user(session) from the database, without saving hes/her order(s).
    """
    closeSingleOrder(input: CloseSingleOrderInput): String
    """
    This mutation closes/deletes an user(session) from the database, as well, saves the order to the database.
    """
    closeSingleOrderAndSave(input: CloseSingleOrderAndSaveInput): String
    """
    This mutation closes all users in a particular table from the database.
    """
    closeTableOrders(input: CloseTableOrdersInput): String
    """
    This mutation closes all users in a particular table from the database, and saves their orders to the database.
    """
    closeTableOrdersAndSave(input: CloseTableOrdersAndSaveInput): String
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
    """
    This subscription listens to the creation of orders.

    Note*: This is specially made for the kitchen.
    """
    orderCreation(restaurantId: ID!): CreateOrder
    """
    This subscription listens to the status of an order.

    Status: Complete - Update - Delete

    Complete: Order is complete

    Update: Order was just updated from the staff, *comes with a payload.

    Delete: Order/session was deleted.

    Note: This is made for the users/garcons.
    """
    orderStatus(userId: ID!): OrderStatus
  }
`;

export default typeDefs;
