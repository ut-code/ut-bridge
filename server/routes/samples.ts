import { getAuth } from "@hono/clerk-auth";
import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";

export default new Hono().get("/login", async (c) => {
  const auth = getAuth(c);
  if (!auth) throw new HTTPException(401, { message: "not authorized" });
  return c.json({ you: auth?.userId });
});
