import { Hono } from "hono";
import cors from "./middlewares/cors.ts";
import campusRouter from "./routes/campus.ts";
import communityRouter from "./routes/community.ts";
import divisionRouter from "./routes/division.ts";
import languageRouter from "./routes/language.ts";
import universityRouter from "./routes/university.ts";
import usersRoutes from "./routes/users.ts";

const app = new Hono()
  .use(cors("CORS_ALLOW_ORIGINS"))

  .get("/", (c) => c.text("Hello from Hono 🔥"))

  .route("/users", usersRoutes)
  .route("/community", communityRouter)
  .route("/campus", campusRouter)
  .route("/division", divisionRouter)
  .route("/language", languageRouter)
  .route("/university", universityRouter);

export default app;
export type App = typeof app;
