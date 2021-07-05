import mongoose from "mongoose"
import config from "../config"
import { NextApiRequest, NextApiResponse } from "next"

const connectDb = async (
  req: NextApiRequest,
  res: NextApiResponse,
  next: any
) => {
  if (mongoose.connections[0].readyState) {
    // Use current db connection
    return next()
  }

  if (!config.databaseUrl) {
    const { MongoMemoryServer } = await import("mongodb-memory-server")
    const mongoMemoryServer = new MongoMemoryServer()
    config.databaseUrl = await mongoMemoryServer.getUri()
  }

  // Create new db connection
  await mongoose.connect(config.databaseUrl, {
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
    useNewUrlParser: true,
  })
  return next()
}

export default connectDb
