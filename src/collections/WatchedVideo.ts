import db from "@majapisoftwares/next/db";
import { onlyServer } from "@majapisoftwares/next/utils/isServer";
import { schema, types } from "papr";

const watchedVideoSchema = onlyServer(() =>
  schema(
    {
      videoId: types.string({ required: true }),
      userId: types.string({ required: true }),
    },
    {
      timestamps: true,
    }
  )
);

const getWatchedVideo = () =>
  onlyServer(() => db.model("watchedvideos", watchedVideoSchema));

export type IWatchedVideo = (typeof watchedVideoSchema)[0];

export default getWatchedVideo;
