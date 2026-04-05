import type { NextApiRequest, NextApiResponse } from "next";
import getWatchedVideoModel from "../../../collections/WatchedVideo";
import connectDb from "../../../db/db";
import { badRequest, readString, withApi } from "../../../lib/api";

async function handler(req: NextApiRequest, res: NextApiResponse<void>) {
  const userId = readString(req.body?.userId);
  const videoId = readString(req.body?.videoId);

  if (!userId || !videoId) {
    throw badRequest("userId and videoId are required.");
  }

  await connectDb();
  const WatchedVideo = getWatchedVideoModel();

  await WatchedVideo.deleteOne({
    userId,
    videoId,
  });

  res.status(204).end();
}

export default withApi(["POST"], handler);
