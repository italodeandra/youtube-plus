import { apiHandlerWrapper } from "@italodeandra/next/api/apiHandlerWrapper";
import { badRequest } from "@italodeandra/next/api/errors";
import getWatchedVideo from "../../../collections/WatchedVideo";
import connectDb from "../../../db/db";

async function handler(args: { userId: string }) {
  await connectDb();
  const WatchedVideo = getWatchedVideo();

  if (!args.userId) {
    throw badRequest;
  }

  return WatchedVideo.find(
    {
      userId: args.userId,
    },
    {
      projection: {
        _id: 0,
        videoId: 1,
      },
    }
  );
}

export default apiHandlerWrapper(handler);
