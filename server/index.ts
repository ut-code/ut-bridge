import { Hono } from "hono";
import cors from "./middlewares/cors";
import communityRouter from "./routes/community";

const app = new Hono()
  .use(cors("CORS_ALLOW_ORIGINS"))
  .route("/community", communityRouter);

export default app;
export type App = typeof app;
