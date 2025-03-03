import { vValidator } from "@hono/valibot-validator";
import { CreateUserSchema } from "common/validation/schema.ts";
import { Hono } from "hono";
import * as v from "valibot";
import { getUserID } from "../../auth/func.ts";
import { prisma } from "../../config/prisma.ts";

const route = new Hono()
  //TODO://型に合わせてupdateの方法も変化させる
  .put("/", vValidator("json", CreateUserSchema), async (c) => {
    const userId = await getUserID(c);
    const body = c.req.valid("json");
    console.log("🤩🤩🤩🤩🤩", userId);
    console.log("⭐⭐⭐⭐⭐", body);

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

  .delete("/", vValidator("param", v.object({ id: v.string() })), async (c) => {
    const userId = await getUserID(c);
    const deletedUser = await prisma.user.delete({
      where: { id: userId },
    });
    return c.json(deletedUser);
  });
export default route;
