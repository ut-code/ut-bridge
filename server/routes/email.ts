import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import z from "zod";
import { verify } from "../email/verification/func.ts";

const route = new Hono().put(
  "/verify",
  zValidator(
    "param",
    z.object({
      id: z.string(),
    }),
  ),
  async (c) => {
    const params = c.req.valid("param");
    await verify(params.id);
    return c.json({ ok: true });
  },
);

export default route;
