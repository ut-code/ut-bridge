import { Hono } from "hono";
import cors from "./middlewares/cors.ts";
import hello from "./routes/hello.ts";

const app = new Hono().use(cors("CORS_ALLOW_ORIGINS")).route("/", hello);

export default app;
export type App = typeof app;
