import { useMutation } from "react-query"
import axios from "axios"
import { IWatchedVideoReqBody } from "../models/WatchedVideo"
import queryClient from "../queryClient";

const useAddWatchedVideo = () =>
  useMutation<string, unknown, IWatchedVideoReqBody>(
    (variables) => axios.post("/api/addWatchedVideo", variables).then((res) => res.data),
    {
      onSuccess(addedVideoId, variables) {
        const queryData = queryClient.getQueryData<string[]>(["watched-videos", variables.userId])
        if (queryData) {
          queryClient.setQueryData<string[]>(
            ["watched-videos", variables.userId],
            [...queryData, addedVideoId]
          )
        }
      },
    }
  )

export default useAddWatchedVideo
