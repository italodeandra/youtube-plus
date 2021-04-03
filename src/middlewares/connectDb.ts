import mongoose from "mongoose"
import config from "../config"
import mongoMemoryServer from "../utils/mongoMemoryServer"
import { NextApiRequest, NextApiResponse } from "next"

const connectDb = async (req: NextApiRequest, res: NextApiResponse, next: any) => {
  if (mongoose.connections[0].readyState) {
    // Use current db connection
    return next()
  }
  // Create new db connection
  await mongoose.connect(
    config.databaseUrl || (await mongoMemoryServer.getUri()),
    {
      useUnifiedTopology: true,
      // useFindAndModify: false,
      // useCreateIndex: true,
      useNewUrlParser: true,
    }
  )
  return next()
}

export default connectDb
