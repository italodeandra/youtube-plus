import type { NextApiHandler, NextApiRequest, NextApiResponse } from "next";

type AllowedMethod = "DELETE" | "GET" | "PATCH" | "POST" | "PUT";

class ApiError extends Error {
  constructor(
    public readonly statusCode: number,
    message: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export function badRequest(message: string) {
  return new ApiError(400, message);
}

export function readString(value: string | string[] | undefined) {
  if (Array.isArray(value)) {
    return value[0]?.trim() ?? "";
  }

  return value?.trim() ?? "";
}

export function readCsv(value: string | string[] | undefined) {
  return Array.from(
    new Set(readString(value).split(",").map((item) => item.trim())),
  ).filter(Boolean);
}

function setCorsHeaders(res: NextApiResponse) {
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,DELETE,PATCH,POST,PUT,OPTIONS",
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version",
  );
}

export function withApi(
  methods: AllowedMethod[],
  handler: (
    req: NextApiRequest,
    res: NextApiResponse,
  ) => Promise<void>,
): NextApiHandler {
  return async (req, res) => {
    setCorsHeaders(res);

    if (req.method === "OPTIONS") {
      res.status(204).end();
      return;
    }

    if (!req.method || !methods.includes(req.method as AllowedMethod)) {
      res.setHeader("Allow", [...methods, "OPTIONS"].join(", "));
      res.status(405).json({ error: "Method Not Allowed" });
      return;
    }

    try {
      await handler(req, res);
    } catch (error) {
      console.error(error);

      if (res.writableEnded) {
        return;
      }

      if (error instanceof ApiError) {
        res.status(error.statusCode).json({ error: error.message });
        return;
      }

      res.status(500).json({ error: "Internal Server Error" });
    }
  };
}
