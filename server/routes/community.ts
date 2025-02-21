import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import z from "zod";
import { prisma } from "../config/prisma.ts";

const router = new Hono().get(
  "/",
  zValidator("query", z.object({ id: z.string() })),
  async (c) => {
    const { id } = c.req.query();
    const users = await prisma.user.findMany({
      where: {
        id: { not: id },
      },
      select: {
        id: true,
        name: true,
        gender: true,
        isForeignStudent: true,
        imageUrl: true,
        campus: {
          select: {
            name: true,
          },
        },
        grade: true,
        motherLanguage: {
          select: {
            name: true,
          },
        },
        fluentLanguages: {
          select: {
            language: {
              select: { name: true },
            },
          },
        },
        learningLanguages: {
          select: {
            language: {
              select: { name: true },
            },
          },
        },
      },
    });
    return c.json({ users });
  },
);

export default router;
