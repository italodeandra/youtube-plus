import { useQuery } from "react-query"
import { notify } from "@italodeandra/pijama/components/Snackbar/snackbarState"
import queryClient from "../queryClient"

const queryKeyCurrentProfileId = `youtube-current-profile-id`
const queryFnCurrentProfileId = () =>
  fetch("https://www.youtube.com/profile").then((res) => {
    if (!res.url.startsWith("https://www.youtube.com/channel/")) {
      throw Error("Can't get the ID")
    }
    return res.url.replace("https://www.youtube.com/channel/", "")
  })

export const getCurrentProfileId = () =>
  queryClient.getQueryData<Error>(queryKeyCurrentProfileId)

const useCurrentProfileId = () =>
  useQuery<unknown, Error, string>(
    queryKeyCurrentProfileId,
    queryFnCurrentProfileId,
    {
      onError() {
        notify("You need to be signed in to mark videos as watched")
      },
      retry(failureCount, error) {
        if (error.message === "Can't get the ID") {
          return false
        }
        return failureCount < 3
      },
      refetchOnWindowFocus: false,
    }
  )

export default useCurrentProfileId
