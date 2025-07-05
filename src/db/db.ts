import { connectDb as connect } from "@majapisoftwares/next/db";
import migration from "./migration";

export default async function connectDb() {
  await connect([migration]);
}
