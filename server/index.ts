import { Hono } from "hono";
import hello from "./routes/hello";

const app = new Hono().route("/", hello);

export default app;
export type App = typeof app;
