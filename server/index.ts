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
import emailRouter from "./routes/email.ts";
import imageRouter from "./routes/image.ts";
import languageRouter from "./routes/language.ts";
import pushRouter from "./routes/push.ts";
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
  .use(cors())
  // TODO(PERF):: delete this in production
  .use(async (c, next) => {
    const latency = Number.parseInt(env(c, "ARTIFICIAL_NETWORK_LATENCY", { fallback: "0" }));
    await Bun.sleep(latency);
    await next();
  })
  .onError((err, c) => {
    console.log(err);
    if (err instanceof PrismaClientKnownRequestError) {
      if (err.code === "P2003") {
        console.log(err);
        return c.json({ error: "database constraint violated" }, 409);
      }
    }
    if (err instanceof HTTPException) {
      return c.json({ error: err.message }, err.status);
    }
    console.error(err);
    return c.json({ error: "unknown error occured" }, 500);
  })

  .get("/", (c) => c.text("ut-bridge: Hello from Hono 🔥"))

  .route("/users", usersRouter)
  .route("/community", communityRouter)
  .route("/campus", campusRouter)
  .route("/division", divisionRouter)
  .route("/language", languageRouter)
  .route("/university", universityRouter)
  .route("/chat", chatRouter)
  .route("/push", pushRouter)
  .route("/image", imageRouter)
  .route("/email", emailRouter);

export default app;
export type App = typeof app;
