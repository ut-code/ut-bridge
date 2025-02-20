import { Hono } from "hono";
import { prisma } from "../config/prisma";

const router = new Hono().get("/", async (c) => {
  const universities = await prisma.university.findMany({
    select: {
      id: true,
      name: true,
    },
  });
  return c.json(universities);
});

export default router;
