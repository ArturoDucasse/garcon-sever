import { ApolloServer } from "apollo-server-express";
import { ApolloServerPluginDrainHttpServer } from "apollo-server-core";

import typeDefs from "../../graphql/typeDefs";
import resolvers from "../../graphql/resolvers";

export default async function startApolloServer(httpServer: any) {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })]
  });
  return server;
}
