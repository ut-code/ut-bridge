import { clerkMiddleware } from "@hono/clerk-auth";
import { Hono } from "hono";
import cors from "./middlewares/cors";
import communityRouter from "./routes/community";
import usersRoutes from "./routes/users";

const app = new Hono()
  // Clerk middleware. https://github.com/honojs/middleware/tree/main/packages/clerk-auth
  .use(clerkMiddleware())
  .use(cors("CORS_ALLOW_ORIGINS"))
  .get("/", (c) => c.text("Hello from Hono 🔥"))

  .route("/users", usersRoutes)
  .route("/community", communityRouter);

export default app;
export type App = typeof app;
