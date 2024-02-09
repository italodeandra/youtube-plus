import { apiHandlerWrapper } from "@italodeandra/next/api/apiHandlerWrapper";
import { badRequest } from "@italodeandra/next/api/errors";
import getWatchedVideo from "../../../collections/WatchedVideo";
import connectDb from "../../../db/db";

async function handler(args: { userId: string; videosIds: string }) {
  await connectDb();
  const WatchedVideo = getWatchedVideo();

  if (!args.userId) {
    throw badRequest;
  }

  return (
    await WatchedVideo.find(
      {
        userId: args.userId,
        videoId: { $in: args.videosIds.split(",") },
      },
      {
        projection: {
          videoId: 1,
        },
      }
    )
  ).map((v) => v.videoId);
}

export default apiHandlerWrapper(handler);
