import { apiHandlerWrapper } from "@majapisoftwares/next/api/apiHandlerWrapper";
import { badRequest } from "@majapisoftwares/next/api/errors";
import getWatchedVideo from "../../../collections/WatchedVideo";
import connectDb from "../../../db/db";

async function handler(args: { videoId: string; userId: string }) {
  await connectDb();
  const WatchedVideo = getWatchedVideo();

  if (!args.userId || !args.videoId) {
    throw badRequest;
  }

  await WatchedVideo.deleteMany({
    userId: args.userId,
    videoId: args.videoId,
  });
}

export default apiHandlerWrapper(handler);
