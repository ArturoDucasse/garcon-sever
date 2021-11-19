import { MongoClient } from "mongodb";
import { connect, ConnectOptions } from "mongoose";

const mongoConnection = async () => {
  return await connect(
    "mongodb+srv://r2d2:3muCWbiTQe5gavkV@garcon-cluster0.0bjta.mongodb.net/garcon?retryWrites=true&w=majority",
    { useNewUrlParser: true, useUnifiedTopology: true } as ConnectOptions
  );
};

export default mongoConnection;

// Replace the uri string with your MongoDB deployment's connection string.
const uri =
  "mongodb+srv://r2d2:3muCWbiTQe5gavkV@garcon-cluster0.0bjta.mongodb.net";

const client = new MongoClient(uri);

interface IMDB {
  rating: number;
  votes: number;
  id: number;
}

export interface Movie {
  title: string;
  year: number;
  released: Date;
  plot: string;
  type: "movie" | "series";
  imdb: IMDB;
}

type MovieSummary = Pick<Movie, "title" | "imdb">;

async function run(): Promise<void> {
  try {
    await client.connect();

    const database = client.db("sample_mflix");
    // Specifying a Schema is always optional, but it enables type hinting on
    // finds and inserts
    const movies = database.collection<Movie>("movies");

    const movie = await movies.findOne<MovieSummary>(
      { title: "The Room" },
      {
        sort: { rating: -1 },
        projection: { _id: 0, title: 1, imdb: 1 }
      }
    );
    console.log(movie);
  } finally {
    await client.close();
  }
}
run().catch(console.dir);
