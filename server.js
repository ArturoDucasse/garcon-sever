import { ApolloServer, gql } from "apollo-server-express";
import AdminBroExpress from "@admin-bro/express";
import AdminBroMongoose from "@admin-bro/mongoose";
import express from "express";
import AdminBro from "admin-bro";
import mongoose from "mongoose";

AdminBro.registerAdapter(AdminBroMongoose);

const app = express();
const port = 3000;

const typeDefs = gql`
  type Book {
    title: String
    author: String
  }

  type Query {
    books: Book
  }
`;

const resolvers = {
  Query: {
    books: () => {
      return { title: "test", author: "Tester" };
    }
  }
};
const server = new ApolloServer({ typeDefs, resolvers });

const run = async () => {
  const database = await mongoose.connect(
    "mongodb+srv://r2d2:3muCWbiTQe5gavkV@garcon-cluster0.0bjta.mongodb.net/garcon?retryWrites=true&w=majority",
    { useNewUrlParser: true }
  );
  const User = mongoose.model("User", {
    name: String,
    email: String,
    surname: String
  });

  const adminBro = new AdminBro({
    databases: [database],
    resources: [User],
    rootPath: "/admin"
  });

  await server.start();
  server.applyMiddleware({ app });

  const router = AdminBroExpress.buildRouter(adminBro);
  app.use(adminBro.options.rootPath, router);
};

run();

app.listen(port, () => console.log("AdminBro is under localhost:8080/admin"));
