import WatchedVideo, { IWatchedVideoReqQuery } from "../../models/WatchedVideo"
import { NextApiHandler } from "next"
import { connectDb, runMiddleware } from "../../middlewares"

const listWatchedVideos: NextApiHandler = async (req, res) => {
  await runMiddleware(req, res, connectDb)

  const userId = req.query.userId as IWatchedVideoReqQuery["userId"]

  if (!userId) {
    return res.status(400).send("Bad Request")
  }

  const watchedVideos = await WatchedVideo.find(
    {
      userId,
    },
    "videoId -_id"
  )
    .distinct("videoId")
    .exec()

  res.status(200).json(watchedVideos)
}

// noinspection JSUnusedGlobalSymbols
export default listWatchedVideos