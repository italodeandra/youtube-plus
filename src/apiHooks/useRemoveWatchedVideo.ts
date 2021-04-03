import { useMutation } from "react-query"
import axios from "axios"
import { IWatchedVideoReqBody } from "../models/WatchedVideo"
import queryClient from "../queryClient"
import { filter } from "lodash"

const useRemoveWatchedVideo = () =>
  useMutation<unknown, unknown, IWatchedVideoReqBody>(
    (data) =>
      axios.post("/api/removeWatchedVideo", data).then((res) => res.data),
    {
      onSuccess(data, variables) {
        const queryData = queryClient.getQueryData<string[]>([
          "watched-videos",
          variables.userId,
        ])
        if (queryData) {
          queryClient.setQueryData<string[]>(
            ["watched-videos", variables.userId],
            filter(queryData, (id) => id !== variables.videoId)
          )
        }
      },
    }
  )

export default useRemoveWatchedVideo
