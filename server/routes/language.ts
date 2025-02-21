import { Hono } from "hono";
import { prisma } from "../config/prisma.ts";

const router = new Hono().get("/", async (c) => {
  const divisions = await prisma.language.findMany({
    select: {
      id: true,
      name: true,
    },
  });
  return c.json(divisions);
});

export default router;
