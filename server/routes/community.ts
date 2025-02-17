import { PrismaClient } from "@prisma/client";
import { Hono } from "hono";

const prisma = new PrismaClient();
const router = new Hono().get("/", async (c) => {
  try {
    const users = await prisma.user.findMany({
      select: {
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
      name: user.name,
      gender: user.gender ? genderMap[user.gender] : null,
      imageUrl: user.imageUrl,
      campus: user.campus?.name || null,
      motherTongues: user.motherTongues.map((mt) => mt.language.name),
      fluentLanguages: user.fluentLanguages.map((fl) => fl.language.name),
      learningLanguages: user.learningLanguages.map((ll) => ll.language.name),
    }));

    return c.json({ users: formattedUsers });
  } catch (error) {
    console.error(error);
    return c.json({ error: "Failed to fetch users" }, 500);
  }
});

export default router;
