import { apiHandlerWrapper } from "@italodeandra/next/api/apiHandlerWrapper";
import { badRequest } from "@italodeandra/next/api/errors";
import getWatchedVideo from "../../../collections/WatchedVideo";
import connectDb from "../../../db/db";

async function handler(args: { videoId: string; userId: string }) {
  await connectDb();
  const WatchedVideo = getWatchedVideo();

  if (!args.userId || !args.videoId) {
    throw badRequest;
  }

  await WatchedVideo.findOneAndUpdate(
    {
      userId: args.userId,
      videoId: args.videoId,
    },
    {
      $setOnInsert: {
        userId: args.userId,
        videoId: args.videoId,
      },
    },
    {
      upsert: true,
    }
  );
}

export default apiHandlerWrapper(handler);
