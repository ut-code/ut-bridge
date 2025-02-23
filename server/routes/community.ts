import { zValidator } from "@hono/zod-validator";
import type { Prisma } from "@prisma/client";
import { Hono } from "hono";
import z from "zod";
import { prisma } from "../config/prisma.ts";

const router = new Hono().get(
  "/",
  zValidator(
    "query",
    z.object({
      id: z.string(),
      page: z.coerce.number().default(1),
      exchangeQuery: z.enum(["exchange", "japanese", "all"]).default("all"),
      searchQuery: z.string().default(""),
    }),
  ),
  async (c) => {
    const { page, exchangeQuery, searchQuery } = c.req.valid("query");
    const take = 9;
    const skip = (page - 1) * take;

    const whereCondition: Prisma.UserWhereInput = {};

    // 言語交換フィルター
    if (exchangeQuery === "exchange") {
      whereCondition.isForeignStudent = true;
    } else if (exchangeQuery === "japanese") {
      whereCondition.isForeignStudent = false;
    }

    // 検索フィルター
    if (searchQuery) {
      whereCondition.OR = [
        { name: { contains: searchQuery, mode: "insensitive" } },
        { campus: { name: { contains: searchQuery, mode: "insensitive" } } },
        {
          motherLanguage: {
            name: { contains: searchQuery, mode: "insensitive" },
          },
        },
        {
          fluentLanguages: {
            some: {
              language: {
                name: { contains: searchQuery, mode: "insensitive" },
              },
            },
          },
        },
        {
          learningLanguages: {
            some: {
              language: {
                name: { contains: searchQuery, mode: "insensitive" },
              },
            },
          },
        },
      ];
    }

    const [users, totalUsers] = await Promise.all([
      prisma.user.findMany({
        where: whereCondition,
        skip,
        take,
        select: {
          id: true,
          name: true,
          gender: true,
          isForeignStudent: true,
          imageUrl: true,
          campus: { select: { name: true } },
          grade: true,
          motherLanguage: true,
          fluentLanguages: {
            select: { language: true },
          },
          learningLanguages: {
            select: { language: true },
          },
        },
      }),
      prisma.user.count({ where: whereCondition }),
    ]);

    return c.json({ users, totalUsers });
  },
);

export default router;
