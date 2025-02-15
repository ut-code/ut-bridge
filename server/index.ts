import { Context, Hono, Next } from "hono";
import cors from "./middlewares/cors";
import hello from "./routes/hello";

const app = new Hono().use(cors("CORS_ALLOW_ORIGINS")).route("/", hello);

export default app;
export type App = typeof app;
