import mongoose from "mongoose";

const globalForMongo = globalThis as typeof globalThis & {
  mongooseConnectionPromise?: Promise<typeof mongoose>;
};

function createMongooseConnectionPromise() {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error("Missing MONGODB_URI environment variable.");
  }

  return mongoose.connect(uri, {
    dbName: process.env.MONGODB_DB || undefined,
  });
}

export default async function connectDb() {
  if (mongoose.connection.readyState === 1) {
    return mongoose;
  }

  if (!globalForMongo.mongooseConnectionPromise) {
    globalForMongo.mongooseConnectionPromise = createMongooseConnectionPromise().catch(
      (error) => {
        delete globalForMongo.mongooseConnectionPromise;
        throw error;
      },
    );
  }

  return globalForMongo.mongooseConnectionPromise;
}
