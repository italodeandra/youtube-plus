import WatchedVideo, { IWatchedVideoReqBody } from "../../models/WatchedVideo"
import { NextApiHandler, NextApiRequest, NextApiResponse } from "next"
import { connectDb, cors, runMiddleware } from "../../middlewares"

const addWatchedVideo: NextApiHandler = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  await runMiddleware(req, res, cors)
  await runMiddleware(req, res, connectDb)

  const newWatchedVideoDoc = req.body as IWatchedVideoReqBody

  if (
    !newWatchedVideoDoc ||
    !newWatchedVideoDoc.userId ||
    !newWatchedVideoDoc.videoId
  ) {
    return res.status(400).send("Bad Request")
  }

  const existingVideo = await WatchedVideo.findOne({
    userId: newWatchedVideoDoc.userId,
    videoId: newWatchedVideoDoc.videoId
  }).exec()
  if (existingVideo) {
    return res.status(200).send(existingVideo.videoId)
  }

  const newWatchedVideo = new WatchedVideo({
    userId: newWatchedVideoDoc.userId,
    videoId: newWatchedVideoDoc.videoId,
  })

  await newWatchedVideo.save()

  res.status(200).send(newWatchedVideo.videoId)
}

// noinspection JSUnusedGlobalSymbols
export default addWatchedVideo