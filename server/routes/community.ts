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
      page: z.string().optional(),
      isExchangeEnabled: z.string().optional(),
      searchQuery: z.string().optional(), // 🔹 検索クエリを追加
    }),
  ),
  async (c) => {
    const page = Number.parseInt(c.req.query("page") || "1", 10);
    const isExchangeEnabled = c.req.query("isExchangeEnabled") === "true";
    const searchQuery = c.req.query("searchQuery")?.toLowerCase() || "";
    const take = 9;
    const skip = (page - 1) * take;

    const myUser = await prisma.user.findUnique({
      where: { id: c.req.query("id") },
      select: { isForeignStudent: true },
    });

    if (!myUser) {
      return c.json({ users: [], totalUsers: 0 });
    }

    const whereCondition: Prisma.UserWhereInput = {};

    // 言語交換フィルター
    if (isExchangeEnabled) {
      whereCondition.isForeignStudent = { not: myUser.isForeignStudent };
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

    // 🔹 ユーザー取得
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
          motherLanguage: { select: { name: true } },
          fluentLanguages: {
            select: { language: { select: { name: true } } },
          },
          learningLanguages: {
            select: { language: { select: { name: true } } },
          },
        },
      }),
      prisma.user.count({ where: whereCondition }),
    ]);

    return c.json({ users, totalUsers });
  },
);

export default router;
