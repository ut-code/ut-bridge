import { zValidator } from "@hono/zod-validator";
import { CreateUserSchema } from "common/zod/schema.ts";
import { Hono } from "hono";
import { z } from "zod";
import { prisma } from "../../config/prisma.ts";
import markers from "./markers.ts";
import me from "./me.ts";

const router = new Hono()
  .route("/markers", markers)
  .route("/me", me)

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
          id,
          guid,
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
  });

export default router;
