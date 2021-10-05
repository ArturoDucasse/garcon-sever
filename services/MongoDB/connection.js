import mongoose from "mongoose";

const database = await mongoose.connect(
  "mongodb+srv://r2d2:3muCWbiTQe5gavkV@garcon-cluster0.0bjta.mongodb.net/garcon?retryWrites=true&w=majority",
  { useNewUrlParser: true }
);

export default database;
