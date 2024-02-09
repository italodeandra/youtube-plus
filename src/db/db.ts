import { connectDb as connect } from "@italodeandra/next/db";
import migration from "./migration";

export default async function connectDb() {
  await connect([migration]);
}
