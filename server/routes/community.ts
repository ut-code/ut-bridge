import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import z from "zod";
import { prisma } from "../config/prisma.ts";

const router = new Hono().get(
  "/",
  zValidator(
    "query",
    z.object({
      id: z.string(),
      page: z.string().optional(),
    }),
  ),
  async (c) => {
    const page = Number.parseInt(c.req.query("page") || "1", 10);
    const take = 9;
    const skip = (page - 1) * take;

    const [users, totalUsers] = await Promise.all([
      prisma.user.findMany({
        skip,
        take,
        select: {
          id: true,
          name: true,
          gender: true,
          isForeignStudent: true,
          imageUrl: true,
          campus: {
            select: { name: true },
          },
          grade: true,
          motherLanguage: {
            select: { name: true },
          },
          fluentLanguages: {
            select: {
              language: { select: { name: true } },
            },
          },
          learningLanguages: {
            select: {
              language: { select: { name: true } },
            },
          },
        },
      }),
      prisma.user.count(),
    ]);

    return c.json({ users, totalUsers });
  },
);

export default router;
