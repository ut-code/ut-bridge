import { vValidator } from "@hono/valibot-validator";
import { Hono } from "hono";
import * as v from "valibot";
import { prisma } from "../config/prisma.ts";

const router = new Hono().get("/", vValidator("query", v.object({ id: v.optional(v.string()) })), async (c) => {
  const universityId = c.req.valid("query").id;

  const campuses = await prisma.campus.findMany({
    where: {
      universityId: universityId,
    },
    select: {
      id: true,
      name: true,
    },
  });
  return c.json(campuses);
});

export default router;
