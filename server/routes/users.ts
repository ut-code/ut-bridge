import { zValidator } from "@hono/zod-validator";
import { CreateUserSchema } from "common/zod/schema.ts";
import { Hono } from "hono";
import { z } from "zod";
import { prisma } from "../config/prisma.ts";

const router = new Hono()

  .get(
    "/", // userId以外にも、nameなどでそのユーザーのデータを持ってきたい場合は、ここを編集する
    zValidator("query", z.object({ id: z.string().optional() })),
    async (c) => {
      const userId = c.req.valid("query").id;
      const user = await prisma.user.findMany({
        where: { id: userId },
        include: {
          division: true,
          campus: true,
          motherLanguage: true,
          fluentLanguages: { select: { language: { select: { name: true } } } },
          learningLanguages: {
            select: { language: { select: { name: true } } },
          },
        },
      });
      return c.json(user);
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
  .put("/:id", zValidator("param", z.object({ id: z.string() })), async (c) => {
    const userId = c.req.valid("param").id;
    const updateContent = await c.req.json();
    const updatedUser = await prisma.user.update({
      where: {
        id: userId,
      },
      data: updateContent,
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
