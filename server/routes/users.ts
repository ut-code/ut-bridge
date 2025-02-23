import { zValidator } from "@hono/zod-validator";
import { CreateUserSchema } from "common/zod/schema.ts";
import { Hono } from "hono";
import { z } from "zod";
import { prisma } from "../config/prisma.ts";

const router = new Hono()

  .get(
    "/",
    zValidator(
      "query",
      z.object({ id: z.string().optional(), guid: z.string().optional() }),
    ),
    async (c) => {
      const { id, guid } = c.req.valid("query") ?? {};
      const users = await prisma.user.findMany({
        where: {
          OR: [id ? { id: id } : {}, guid ? { guid: guid } : {}],
        },
        include: {
          division: true,
          campus: true,
          motherLanguage: true,
          fluentLanguages: {
            select: { language: true },
          },
          learningLanguages: {
            select: { language: true },
          },
        },
      });
      return c.json(users);
    },
  )

  .get(
    "/exist",
    zValidator(
      "query",
      z
        .object({ guid: z.string().optional(), userId: z.string().optional() })
        .optional(),
    ),
    async (c) => {
      const { guid, userId } = c.req.valid("query") ?? {};

      const user = await prisma.user.findFirst({
        where: {
          guid: guid,
          id: userId,
        },
        select: { guid: true, id: true, name: true },
      });

      let resp: { exists: false } | { exists: true; guid: string; id: string };
      if (!user || !user.name) {
        resp = { exists: false };
        return c.json(resp, 404);
      }
      resp = { exists: true, guid: user.guid, id: user.id };
      return c.json(resp, 200);
    },
  )

  .post("/", zValidator("json", CreateUserSchema), async (c) => {
    const body = c.req.valid("json");
    const newUser = await prisma.user.create({
      data: {
        id: body.id,
        guid: body.guid,
        imageUrl: body.imageUrl,
        name: body.name,
        gender: body.gender,
        isForeignStudent: body.isForeignStudent,
        displayLanguage: body.displayLanguage,
        grade: body.grade,
        divisionId: body.divisionId,
        campusId: body.campusId,
        hobby: body.hobby,
        introduction: body.introduction,
        motherLanguageId: body.motherLanguageId,
        fluentLanguages: {
          create: body.fluentLanguageIds.map((langId) => ({
            languageId: langId,
          })),
        },
        learningLanguages: {
          create: body.learningLanguageIds.map((langId) => ({
            languageId: langId,
          })),
        },
      },
    });
    return c.json(newUser);
  })

  //TODO://型に合わせてupdateの方法も変化させる
  .put("/", zValidator("json", CreateUserSchema), async (c) => {
    const userId = c.req.valid("json").id;
    const body = c.req.valid("json");
    console.log("🤩🤩🤩🤩🤩", userId);
    console.log("⭐️⭐️⭐️⭐️⭐️", body);

    const updatedUser = await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        guid: body.guid,
        imageUrl: body.imageUrl,
        name: body.name,
        gender: body.gender,
        isForeignStudent: body.isForeignStudent,
        displayLanguage: body.displayLanguage,
        grade: body.grade,
        divisionId: body.divisionId,
        campusId: body.campusId,
        hobby: body.hobby,
        introduction: body.introduction,
        motherLanguageId: body.motherLanguageId,

        // 既存データを削除して新規追加 (fluentLanguages)
        fluentLanguages: {
          deleteMany: { userId }, // 既存データ削除
          createMany: {
            data: body.fluentLanguageIds.map((langId) => ({
              languageId: langId,
            })),
          },
        },

        // 既存データを削除して新規追加 (learningLanguages)
        learningLanguages: {
          deleteMany: { userId }, // 既存データ削除
          createMany: {
            data: body.learningLanguageIds.map((langId) => ({
              languageId: langId,
            })),
          },
        },
      },
    });

    return c.json(updatedUser);
  })

  .delete(
    "/:id",
    zValidator("param", z.object({ id: z.string() })),
    async (c) => {
      const userId = c.req.valid("param").id;
      const deletedUser = await prisma.user.delete({
        where: { id: userId },
      });
      return c.json(deletedUser);
    },
  );

export default router;
