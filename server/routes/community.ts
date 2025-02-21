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

    // const formattedUsers: CardUser[] = users.map((user) => ({
    //   id: user.id,
    //   imageUrl: user.imageUrl,
    //   name: user.name,
    //   gender: user.gender as "male" | "female" | "other", //TODO:prismaのenumと定義したenumが大文字とかで違うため、このようにした
    //   isForeignStudent: user.isForeignStudent,
    //   grade: user.grade as
    //     | "B1"
    //     | "B2"
    //     | "B3"
    //     | "B4"
    //     | "M1"
    //     | "M2"
    //     | "D1"
    //     | "D2"
    //     | "D3",
    //   campus: user.campus?.name || null,
    //   motherLanguage: user.motherLanguage?.name || null,
    //   fluentLanguages: user.fluentLanguages.map((fl) => fl.language.name),
    //   learningLanguages: user.learningLanguages.map((ll) => ll.language.name),
    // }));
    return c.json({ users });
  },
);

export default router;
