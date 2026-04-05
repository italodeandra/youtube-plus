import { model, models, type Model, Schema } from "mongoose";

export interface IWatchedVideo {
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  videoId: string;
}

const watchedVideoSchema = new Schema<IWatchedVideo>(
  {
    videoId: {
      type: String,
      required: true,
      trim: true,
    },
    userId: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

watchedVideoSchema.index(
  {
    userId: 1,
    videoId: 1,
  },
  {
    unique: true,
  },
);

export default function getWatchedVideoModel(): Model<IWatchedVideo> {
  return (
    (models.WatchedVideo as Model<IWatchedVideo> | undefined) ??
    model<IWatchedVideo>("WatchedVideo", watchedVideoSchema, "watchedvideos")
  );
}
