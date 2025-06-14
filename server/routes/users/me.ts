import { zValidator } from "@hono/zod-validator";
import { CreateUserSchema, type MYDATA } from "common/zod/schema.ts";
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
          grade: body.grade ?? undefined,
          divisionId: body.divisionId ?? undefined,
          campusId: body.campusId ?? undefined,
          hobby: body.hobby ?? undefined,
          introduction: body.introduction ?? undefined,
          motherLanguageId: body.motherLanguageId ?? undefined,
          wantToMatch: body.wantToMatch,
          // do NOT update customEmail here. use /email/register instead.
          customEmail: undefined,
          allowNotifications: body.allowNotifications,
          allowPeriodicNotifications: body.allowPeriodicNotifications,

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
        include: {
          campus: {
            include: {
              university: true,
            },
          },
          division: true,
          motherLanguage: true,
          fluentLanguages: {
            include: {
              language: true,
            },
          },
          learningLanguages: {
            include: {
              language: true,
            },
          },
          marking: true,
          markedAs: true,
        },
      });

      return c.json(updatedUser);
    },
  )

  .delete("/", zValidator("header", z.object({ Authorization: z.string() })), async (c) => {
    const userId = await getUserID(c);
    await prisma.room.deleteMany({
      where: {
        members: {
          some: {
            userId,
          },
        },
      },
    });
    const deletedUser = await prisma.user.delete({
      where: { id: userId },
    });
    return c.json(deletedUser);
  })

  .get("/", zValidator("header", z.object({ Authorization: z.string() })), async (c) => {
    const userId = await getUserID(c);
    const user: MYDATA | null = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        campus: {
          include: {
            university: true,
          },
        },
        division: true,
        motherLanguage: true,
        fluentLanguages: {
          include: {
            language: true,
          },
        },
        learningLanguages: {
          include: {
            language: true,
          },
        },
        marking: true,
        markedAs: true,
      },
    });
    return c.json(user);
  });

export default route;
