import papr from "@majapisoftwares/next/db";
import getWatchedVideo from "../collections/WatchedVideo";

export default async function migration() {
  const WatchedVideo = getWatchedVideo();

  await WatchedVideo.collection.createIndex(
    {
      userId: 1,
      videoId: 1,
    },
    {
      unique: true,
    }
  );

  console.info("Updating schemas");
  await papr.updateSchemas();
}
