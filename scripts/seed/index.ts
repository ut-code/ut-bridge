import { main as common } from "./common.ts";
import { main as dev } from "./dev.ts";

await common();
if (process.env.NODE_ENV === "development") {
  await dev();
}
