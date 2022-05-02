import WatchedVideo, { IWatchedVideoReqBody } from "../../models/WatchedVideo"
import { NextApiHandler, NextApiRequest, NextApiResponse } from "next"
import { connectDb, cors, runMiddleware } from "../../middlewares"

// noinspection DuplicatedCode
const removeWatchedVideo: NextApiHandler = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  await runMiddleware(req, res, cors)
  await runMiddleware(req, res, connectDb)

  const watchedVideoToRemove = req.body as IWatchedVideoReqBody

  if (
    !watchedVideoToRemove ||
    !watchedVideoToRemove.userId ||
    !watchedVideoToRemove.videoId
  ) {
    return res.status(400).send("Bad Request")
  }

  await WatchedVideo.deleteMany({
    userId: watchedVideoToRemove.userId,
    videoId: watchedVideoToRemove.videoId,
  })

  res.status(200).send("Removed")
}

// noinspection JSUnusedGlobalSymbols
export default removeWatchedVideo
