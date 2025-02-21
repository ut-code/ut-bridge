import { Hono } from "hono";
import cors from "./middlewares/cors";
import campusRouter from "./routes/campus";
import chatRouter from "./routes/chat";
import communityRouter from "./routes/community";
import divisionRouter from "./routes/division";
import languageRouter from "./routes/language";
import universityRouter from "./routes/university";
import usersRouter from "./routes/users";

const app = new Hono()
  .use(cors("CORS_ALLOW_ORIGINS"))
  .onError((err) => {
    console.log(err);
    throw err;
  })

  .get("/", (c) => c.text("Hello from Hono 🔥"))

  .route("/users", usersRouter)
  .route("/community", communityRouter)
  .route("/campus", campusRouter)
  .route("/division", divisionRouter)
  .route("/language", languageRouter)
  .route("/university", universityRouter)
  .route("/chat", chatRouter);

export default app;
export type App = typeof app;
