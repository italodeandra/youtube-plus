import mongoose, { Document, Model } from "mongoose"

export interface IWatchedVideo extends Document {
  videoId: string
  userId: string
}

export interface IWatchedVideoReqBody {
  videoId: string
  userId: string
}

export interface IWatchedVideoReqQuery {
  userId: string
}

const watchedVideoSchema = new mongoose.Schema<IWatchedVideo>({
  videoId: String,
  userId: String,
})

const WatchedVideo: Model<IWatchedVideo> =
  mongoose.models.WatchedVideo || mongoose.model("WatchedVideo", watchedVideoSchema)

export default WatchedVideo
