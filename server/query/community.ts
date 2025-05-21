import crypto from "node:crypto";
import type { Prisma } from "@prisma/client";
import { prisma } from "../config/prisma.ts";

export type Query = {
  except?: string;
  page: number;
  exchangeQuery: "exchange" | "japanese" | "all";
  searchQuery: string;
  marker?: "favorite" | "blocked" | "notBlocked";
  wantsToMatch?: "true";
};

export async function getCommunityUsers(requesterId: string, query: Query, sessionSeed: string) {
  const take = 15; //TODO: web側で指定できるようにする (本当に？)
  const skip = (query.page - 1) * take;
  const whereCondition: Prisma.UserWhereInput = {};

  if (query.wantsToMatch) {
    whereCondition.wantToMatch = query.wantsToMatch === "true";
  }

  // 言語交換フィルター
  if (query.exchangeQuery === "exchange") {
    whereCondition.isForeignStudent = true;
  } else if (query.exchangeQuery === "japanese") {
    whereCondition.isForeignStudent = false;
  }
  if (query.except) {
    whereCondition.id = { not: query.except };
  }

  if (query.marker === "favorite" || query.marker === "blocked") {
    whereCondition.markedAs = {
      some: {
        actorId: requesterId,
        kind: query.marker,
      },
    };
  } else if (query.marker === "notBlocked") {
    whereCondition.markedAs = {
      none: {
        actorId: requesterId,
        kind: "blocked",
      },
    };
  }

  // 検索フィルター
  if (query.searchQuery) {
    whereCondition.OR = [
      { name: { contains: query.searchQuery, mode: "insensitive" } },
      {
        campus: {
          OR: [
            { jaName: { contains: query.searchQuery, mode: "insensitive" } },
            { enName: { contains: query.searchQuery, mode: "insensitive" } },
          ],
        },
      },
      {
        motherLanguage: {
          OR: [
            { jaName: { contains: query.searchQuery, mode: "insensitive" } },
            { enName: { contains: query.searchQuery, mode: "insensitive" } },
          ],
        },
      },
      {
        fluentLanguages: {
          some: {
            language: {
              OR: [
                { jaName: { contains: query.searchQuery, mode: "insensitive" } },
                { enName: { contains: query.searchQuery, mode: "insensitive" } },
              ],
            },
          },
        },
      },
      {
        learningLanguages: {
          some: {
            language: {
              OR: [
                { jaName: { contains: query.searchQuery, mode: "insensitive" } },
                { enName: { contains: query.searchQuery, mode: "insensitive" } },
              ],
            },
          },
        },
      },
    ];
  }

  // ID だけ持ってくる (理由: こちら側でシャッフルして、もう一度 fetch するため)
  const [userIds, totalUsers] = await Promise.all([
    prisma.user.findMany({
      where: whereCondition,
      select: { id: true },
    }),
    prisma.user.count({ where: whereCondition }),
  ]);

  const userIdsAndHash = await Promise.all(
    userIds.map(async (it) => ({ id: it.id, hash: await hash(it.id, sessionSeed) })),
  );
  userIdsAndHash.sort((a, b) => {
    return a.hash.localeCompare(b.hash);
  });

  const finalUserIds = userIdsAndHash.slice(skip, skip + take).map((it) => it.id);
  const _users = await prisma.user.findMany({
    where: {
      id: {
        in: finalUserIds,
      },
    },
    select: {
      id: true,
      name: true,
      gender: true,
      isForeignStudent: true,
      imageUrl: true,
      wantToMatch: true,
      campus: {
        select: { university: true, id: true, jaName: true, enName: true },
      },
      grade: true,
      motherLanguage: { select: { id: true, jaName: true, enName: true } },
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
          actorId: requesterId,
        },
      },
    },
  });

  // user may have deleted their account in the middle of the process
  // it's noth that expensive because we only fetch 15 users
  const users = finalUserIds.map((id) => _users.find((user) => user.id === id)).filter((user) => user !== undefined);

  return {
    users,
    totalUsers,
  };
}

async function hash(...args: string[]) {
  return crypto.createHash("md5").update(args.join("_")).digest("hex");
}
