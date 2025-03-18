import { zValidator } from "@hono/zod-validator";
import type { Prisma } from "@prisma/client";
import { MarkerSchema } from "common/zod/schema.ts";
import { Hono } from "hono";
import { getUserID } from "server/auth/func.ts";
import z from "zod";
import { prisma } from "../config/prisma.ts";

const router = new Hono().get(
  "/",
  zValidator(
    "query",
    z.object({
      except: z.string().optional(),
      page: z.coerce.number().default(1),
      exchangeQuery: z.enum(["exchange", "japanese", "all"]).default("all"),
      searchQuery: z.string().default(""),
      marker: MarkerSchema.optional(),
    }),
  ),
  zValidator("header", z.object({ Authorization: z.string() })),
  async (c) => {
    const requester = await getUserID(c);
    const { except, page, exchangeQuery, searchQuery, marker: markerQuery } = c.req.valid("query");
    const take = 15; //TODO: web側で指定できるようにする
    const skip = (page - 1) * take;

    const whereCondition: Prisma.UserWhereInput = {};

    // 言語交換フィルター
    if (exchangeQuery === "exchange") {
      whereCondition.isForeignStudent = true;
    } else if (exchangeQuery === "japanese") {
      whereCondition.isForeignStudent = false;
    }
    if (except) {
      whereCondition.id = { not: except };
    }

    if (markerQuery) {
      whereCondition.markedAs = {
        some: {
          actorId: requester,
          kind: markerQuery,
        },
      };
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
          campus: { select: { universityId: true, id: true, name: true } },
          grade: true,
          motherLanguage: { select: { id: true, name: true } },
          fluentLanguages: {
            select: { language: true },
          },
          learningLanguages: {
            select: { language: true },
          },
          markedAs: {
            select: {
              kind: true,
            },
            where: {
              actorId: requester,
            },
          },
        },
      }),
      prisma.user.count({ where: whereCondition }),
    ]);

    return c.json({ users, totalUsers });
  },
);

export default router;
