import { zValidator } from "@hono/zod-validator";
import { CreateUserSchema } from "common/zod/schema.ts";
import { Hono } from "hono";
import { z } from "zod";
import { getUserID } from "../../auth/func.ts";
import { prisma } from "../../config/prisma.ts";

const route = new Hono()
  //TODO://型に合わせてupdateの方法も変化させる
  .patch(
    "/",
    zValidator("json", CreateUserSchema.partial()),
    zValidator("header", z.object({ Authorization: z.string() })),
    async (c) => {
      const userId = await getUserID(c);
      const body = c.req.valid("json");

      const updatedUser = await prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          imageUrl: body.imageUrl ?? undefined,
          name: body.name ?? undefined,
          gender: body.gender ?? undefined,
          isForeignStudent: body.isForeignStudent ?? undefined,
          displayLanguage: body.displayLanguage ?? undefined,
          grade: body.grade ?? undefined,
          divisionId: body.divisionId ?? undefined,
          campusId: body.campusId ?? undefined,
          hobby: body.hobby ?? undefined,
          introduction: body.introduction ?? undefined,
          motherLanguageId: body.motherLanguageId ?? undefined,

          // 既存データがある場合のみ削除して新規追加 (fluentLanguages)
          ...(body.fluentLanguageIds?.length
            ? {
                fluentLanguages: {
                  deleteMany: { userId }, // 既存データ削除
                  createMany: {
                    data: body.fluentLanguageIds.map((langId) => ({
                      languageId: langId,
                    })),
                  },
                },
              }
            : {}),

          // 既存データがある場合のみ削除して新規追加 (learningLanguages)
          ...(body.learningLanguageIds?.length
            ? {
                learningLanguages: {
                  deleteMany: { userId }, // 既存データ削除
                  createMany: {
                    data: body.learningLanguageIds.map((langId) => ({
                      languageId: langId,
                    })),
                  },
                },
              }
            : {}),
        },
      });

      return c.json(updatedUser);
    },
  )

  .delete(
    "/",
    zValidator("param", z.object({ id: z.string() })),
    zValidator("header", z.object({ Authorization: z.string() })),
    async (c) => {
      const userId = await getUserID(c);
      const deletedUser = await prisma.user.delete({
        where: { id: userId },
      });
      return c.json(deletedUser);
    },
  );
export default route;
