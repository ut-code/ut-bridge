import { zValidator } from "@hono/zod-validator";
import { CreateUserSchema } from "common/zod/schema.ts";
import { Hono } from "hono";
import { z } from "zod";
import { getUserID } from "../../auth/func.ts";
import { prisma } from "../../config/prisma.ts";

const route = new Hono()
  //TODO://型に合わせてupdateの方法も変化させる
  .patch("/", zValidator("json", CreateUserSchema.partial()), async (c) => {
    const userId = await getUserID(c);
    const body = c.req.valid("json");

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
            data: (body.fluentLanguageIds ?? []).map((langId) => ({
              languageId: langId,
            })),
          },
        },

        // 既存データを削除して新規追加 (learningLanguages)
        learningLanguages: {
          deleteMany: { userId }, // 既存データ削除
          createMany: {
            data: (body.fluentLanguageIds ?? []).map((langId) => ({
              languageId: langId,
            })),
          },
        },
      },
    });

    return c.json(updatedUser);
  })
  .patch(
    "/",
    zValidator(
      "json",
      z.object({
        imageURL: z.string().optional(),
      }),
    ),
    async (c) => {
      const id = await getUserID(c);
      const body = c.req.valid("json");

      const newUser = await prisma.user.update({
        where: { id },
        data: {
          imageUrl: body.imageURL,
        },
      });
      return c.json(newUser);
    },
  )

  .delete("/", zValidator("param", z.object({ id: z.string() })), async (c) => {
    const userId = await getUserID(c);
    const deletedUser = await prisma.user.delete({
      where: { id: userId },
    });
    return c.json(deletedUser);
  });
export default route;
