import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { prisma } from "./config/prisma.ts";
import { env } from "./lib/env.ts";
import cors from "./middlewares/cors.ts";
import campusRouter from "./routes/campus.ts";
import chatRouter from "./routes/chat.ts";
import communityRouter from "./routes/community.ts";
import divisionRouter from "./routes/division.ts";
import languageRouter from "./routes/language.ts";
import universityRouter from "./routes/university.ts";
import usersRouter from "./routes/users/index.ts";

if (process.env.NODE_ENV === "development") {
  prisma.user
    .findFirst({})
    .then(() => {
      console.log("server: database connection OK");
    })
    .catch(() => {
      console.error("server: Could not connect to database");
      process.exit(1);
    });
}

const app = new Hono()
  .use(cors("CORS_ALLOW_ORIGINS"))
  // TODO(PERF):: delete this in production
  .use(async (c, next) => {
    await Bun.sleep(Number.parseInt(env(c, "ARTIFICIAL_NETWORK_LATENCY")));
    await next();
  })
  .onError((err) => {
    console.log(err);
    if (err instanceof PrismaClientKnownRequestError) {
      if (err.code === "P2003") {
        console.log(err);
        throw new HTTPException(409, {
          message: "database constraint violated",
        });
      }
    }
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
