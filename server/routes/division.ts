import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import z from "zod";
import { prisma } from "../config/prisma";

const router = new Hono().get(
  "/",
  zValidator("query", z.object({ id: z.string().optional() })),
  async (c) => {
    const universityId = c.req.valid("query").id;

    const divisions = await prisma.division.findMany({
      where: {
        universityId: universityId,
      },
      select: {
        id: true,
        name: true,
      },
    });
    return c.json(divisions);
  },
);

export default router;
