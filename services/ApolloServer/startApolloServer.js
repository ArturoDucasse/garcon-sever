import { ApolloServer } from "apollo-server-express";
import {
  ApolloServerPluginDrainHttpServer,
  ApolloServerPluginLandingPageGraphQLPlayground
} from "apollo-server-core";
import http from "http";

import typeDefs from "../../graphql/typeDefs.js";
import resolvers from "../../graphql/resolvers.js";

const port = process.env.PORT || 3000;

export default async function startApolloServer(app) {
  const httpServer = http.createServer(app);

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      ApolloServerPluginLandingPageGraphQLPlayground()
    ],
    context: ({ req }) => req,
    introspection: true
  });

  await server.start();
  server.applyMiddleware({ app });

  await new Promise((resolve) => httpServer.listen({ port }, resolve));
  console.log(
    `🚀 Server ready at http://localhost:${port}${server.graphqlPath}`
  );
}
