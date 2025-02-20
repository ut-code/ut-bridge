import { Hono } from "hono";
import { prisma } from "../config/prisma";

const router = new Hono().get("/", async (c) => {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      gender: true,
      imageUrl: true,
      campus: {
        select: {
          name: true,
        },
      },
      motherTongues: {
        select: {
          language: {
            select: { name: true },
          },
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

  const genderMap: Record<string, string> = {
    male: "男",
    female: "女",
    other: "その他",
  };

  const formattedUsers = users.map((user) => ({
    id: user.id,
    name: user.name,
    gender: user.gender ? genderMap[user.gender] : null,
    imageUrl: user.imageUrl,
    campus: user.campus?.name || null,
    motherTongues: user.motherTongues.map((mt) => mt.language.name),
    fluentLanguages: user.fluentLanguages.map((fl) => fl.language.name),
    learningLanguages: user.learningLanguages.map((ll) => ll.language.name),
  }));
  return c.json({ users: formattedUsers });
});

export default router;
