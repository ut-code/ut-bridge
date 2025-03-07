import { Hono } from "hono";
import { prisma } from "../config/prisma.ts";

const router = new Hono().get("/", async (c) => {
  const languages = await prisma.language.findMany({
    select: {
      id: true,
      jaName: true,
      enName: true,
    },
  });
  return c.json(languages);
});

export default router;
