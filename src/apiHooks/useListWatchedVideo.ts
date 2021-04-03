import { useQuery } from "react-query"
import axios from "axios"
import { IWatchedVideo, IWatchedVideoReqQuery } from "../models/WatchedVideo"

const useListWatchedVideos = (userId?: IWatchedVideoReqQuery["userId"]) =>
  useQuery<unknown, unknown, string[]>(
    ["watched-videos", userId],
    () =>
      axios
        .get<IWatchedVideo[]>("/api/listWatchedVideos", {
          params: {
            userId,
          },
        })
        .then((res) => res.data),
    {
      enabled: !!userId,
    }
  )

export default useListWatchedVideos
