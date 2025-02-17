import { clerkMiddleware } from "@hono/clerk-auth";
import { Hono } from "hono";
import cors from "./middlewares/cors";
import community from "./routes/community";
import samples from "./routes/samples";
import users from "./routes/users";

const app = new Hono()
  // Clerk middleware. https://github.com/honojs/middleware/tree/main/packages/clerk-auth
  .use(clerkMiddleware())
  .use(cors("CORS_ALLOW_ORIGINS"))
  .get("/", (c) => c.text("Hello from Hono 🔥"))

  .route("/users", users)
  .route("/samples", samples)
  .route("/community", community);

export default app;
export type App = typeof app;
