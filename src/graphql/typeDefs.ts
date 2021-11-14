import { gql } from "apollo-server-express";

const typeDefs = gql`
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

export default typeDefs;
