import axios from "axios"
import { QueryClient, QueryFunction } from "react-query"
import config from "./config"

axios.defaults.baseURL = config.baseUrl

const defaultQueryFn: QueryFunction = async ({ queryKey }) => {
  const { data } = await axios.get(`${queryKey[0]}`)
  return data
}
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: defaultQueryFn,
    },
  },
})

export default queryClient
