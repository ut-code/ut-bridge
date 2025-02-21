import { PrismaClient } from "@prisma/client";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { prisma } from "./config/prisma";
import cors from "./middlewares/cors";
import campusRouter from "./routes/campus";
import chatRouter from "./routes/chat";
import communityRouter from "./routes/community";
import divisionRouter from "./routes/division";
import languageRouter from "./routes/language";
import universityRouter from "./routes/university";
import usersRouter from "./routes/users";

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
