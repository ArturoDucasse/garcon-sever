import { ApolloServer } from "apollo-server-express";
import { ApolloServerPluginDrainHttpServer } from "apollo-server-core";

import { makeExecutableSchema } from "@graphql-tools/schema";

import typeDefs from "../../graphql/typeDefs";
import resolvers from "../../graphql/resolvers";

const schema = makeExecutableSchema({ typeDefs, resolvers });

export default async function startApolloServer(
  httpServer: any
): Promise<[ApolloServer, typeof schema]> {
  const server = new ApolloServer({
    schema,
    context: ({ req }) => req,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })]
  });
  return [server, schema];
}
