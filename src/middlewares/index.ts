import { NextApiRequest, NextApiResponse } from "next"

export const runMiddleware = (
  req: NextApiRequest,
  res: NextApiResponse,
  fn: any
) =>
  new Promise((resolve, reject) => {
    fn(req, res, (result: any) => {
      if (result instanceof Error) {
        return reject(result)
      }

      return resolve(result)
    })
  })

export { default as connectDb } from "./connectDb"
export { default as cors } from "./cors"