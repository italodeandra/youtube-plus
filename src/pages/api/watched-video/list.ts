import type { NextApiRequest, NextApiResponse } from "next";
import getWatchedVideoModel from "../../../collections/WatchedVideo";
import connectDb from "../../../db/db";
import { badRequest, readString, withApi } from "../../../lib/api";

async function handler(req: NextApiRequest, res: NextApiResponse<string[]>) {
  const userId = readString(req.query.userId);

  if (!userId) {
    throw badRequest("userId is required.");
  }

  await connectDb();
  const WatchedVideo = getWatchedVideoModel();
  const watchedVideos = await WatchedVideo.find({
    userId,
  })
    .select({
      _id: 0,
      videoId: 1,
    })
    .lean()
    .exec();

  res.status(200).json(watchedVideos.map((video) => video.videoId));
}

export default withApi(["GET"], handler);
