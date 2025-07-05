import { apiHandlerWrapper } from "@majapisoftwares/next/api/apiHandlerWrapper";
import { badRequest } from "@majapisoftwares/next/api/errors";
import getWatchedVideo from "../../../collections/WatchedVideo";
import connectDb from "../../../db/db";

async function handler(args: { userId: string }) {
  await connectDb();
  const WatchedVideo = getWatchedVideo();

  if (!args.userId) {
    throw badRequest;
  }

  return (
    await WatchedVideo.find(
      {
        userId: args.userId,
      },
      {
        projection: {
          _id: 0,
          videoId: 1,
        },
      }
    )
  ).map((v) => v.videoId);
}

export default apiHandlerWrapper(handler);
