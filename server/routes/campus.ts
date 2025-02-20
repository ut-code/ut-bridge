import { Hono } from "hono";
import { prisma } from "../config/prisma";

const router = new Hono().get("/", async (c) => {
  const campuses = await prisma.campus.findMany({
    select: {
      id: true,
      name: true,
      universityId: true,
    },
  });
  return c.json(campuses);
});

export default router;
