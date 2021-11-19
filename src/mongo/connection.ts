import { MongoClient } from "mongodb";
import { connect, ConnectOptions } from "mongoose";

const mongoConnection = async () => {
  return await connect(
    "mongodb+srv://r2d2:3muCWbiTQe5gavkV@garcon-cluster0.0bjta.mongodb.net/garcon?retryWrites=true&w=majority",
    { useNewUrlParser: true, useUnifiedTopology: true } as ConnectOptions
  );
};

export default mongoConnection;
