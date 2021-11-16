import { connect, ConnectOptions } from "mongoose";

const mongoConnection = () => {
  return connect(
    "mongodb+srv://r2d2:3muCWbiTQe5gavkV@garcon-cluster0.0bjta.mongodb.net/garcon?retryWrites=true&w=majority",
    { useNewUrlParser: true, useUnifiedTopology: true } as ConnectOptions
  );
};

export default mongoConnection;
