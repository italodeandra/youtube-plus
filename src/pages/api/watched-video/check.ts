import type { NextApiRequest, NextApiResponse } from "next";
import getWatchedVideoModel from "../../../collections/WatchedVideo";
import connectDb from "../../../db/db";
import { badRequest, readCsv, readString, withApi } from "../../../lib/api";

async function handler(req: NextApiRequest, res: NextApiResponse<string[]>) {
  const userId = readString(req.query.userId);
  const videoIds = readCsv(
    typeof req.query.videoIds !== "undefined"
      ? req.query.videoIds
      : req.query.videosIds,
  );

  if (!userId) {
    throw badRequest("userId is required.");
  }

  if (videoIds.length === 0) {
    res.status(200).json([]);
    return;
  }

  await connectDb();
  const WatchedVideo = getWatchedVideoModel();
  const watchedVideos = await WatchedVideo.find(
    {
      userId,
      videoId: { $in: videoIds },
    },
  )
    .select({
      _id: 0,
      videoId: 1,
    })
    .lean()
    .exec();

  res.status(200).json(watchedVideos.map((video) => video.videoId));
}

export default withApi(["GET"], handler);
