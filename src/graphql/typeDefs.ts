import { gql } from "apollo-server-express";
import { Types } from "mongoose";

export type OrderInput = {
  restaurantId: string; //TODO: Delete this field, value will be getted from the req.session
  tableId: number;
  order: [Types.ObjectId];
};

const typeDefs = gql`
  input OrderInput {
    restaurantId: String
    tableId: Int!
    order: [String]
  }

  type ItemMenu {
    _id: ID
    name: String
    description: String
    price: Float
    imageUrl: String
    tableId: Int
    #userId: Int
  }

  type Order {
    restaurantId: String
    tableId: Int
    order: [ItemMenu]
    userId: String
  }

  type Query {
    #query to return a single user order
    #query to return all orders/users from a table
    mock: String
  }

  type Mutation {
    createOrder(input: OrderInput): String
    orderComplete(userId: ID): String
  }

  type Subscription {
    orderCreated(restaurantId: ID): Order
    isOrderComplete(userId: ID!): String
  }
`;

export default typeDefs;
