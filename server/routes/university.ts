import { Hono } from "hono";
import { prisma } from "../config/prisma.ts";

const router = new Hono().get("/", async (c) => {
  const universities = await prisma.university.findMany({
    select: {
      id: true,
      jaName: true,
      enName: true,
    },
  });
  return c.json(universities);
});

export default router;
