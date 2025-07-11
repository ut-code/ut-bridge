import { zValidator } from "@hono/zod-validator";
import { CreateUserSchema, type StructuredUser } from "common/zod/schema.ts";
import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { z } from "zod";
import { getEmailFromIDToken, getGUID, getUserID } from "../../auth/func.ts";
import { prisma } from "../../config/prisma.ts";
import * as verification from "../../email/verification/func.ts";
import markers from "./markers.ts";
import me from "./me.ts";

const router = new Hono()
  .route("/markers", markers)
  .route("/me", me)

  .get(
    "/",
    zValidator("query", z.object({ id: z.string().optional(), guid: z.string().optional() })),
    zValidator("header", z.object({ Authorization: z.string() })),
    async (c) => {
      const userId = await getUserID(c);
      if (!userId)
        throw new HTTPException(401, {
          message: "you need an account to query",
        });
      const { id, guid } = c.req.valid("query") ?? {};
      const users = await prisma.user.findMany({
        where: {
          id,
          guid,
        },
        select: {
          id: true,
          name: true,
          gender: true,
          imageUrl: true,
          isForeignStudent: true,
          grade: true,
          wantToMatch: true,

          hobby: true,
          introduction: true,

          campus: {
            select: {
              id: true,
              jaName: true,
              enName: true,
              university: true,
            },
          },
          division: true,

          motherLanguage: true,
          fluentLanguages: {
            select: { language: true },
          },
          learningLanguages: {
            select: { language: true },
          },

          markedAs: {
            select: {
              kind: true,
            },
            where: {
              actorId: userId,
            },
          },
        },
      });
      return c.json(users satisfies StructuredUser[]);
    },
  )

  .get(
    "/exist",
    zValidator("query", z.object({ guid: z.string().optional(), userId: z.string().optional() }).optional()),
    async (c) => {
      const { guid, userId } = c.req.valid("query") ?? {};

      const user = await prisma.user.findFirst({
        where: {
          guid: guid,
          id: userId,
        },
        select: { guid: true, id: true, name: true },
      });

      type Resp = { exists: false } | { exists: true; guid: string; id: string };
      if (!user || !user.name) {
        return c.json<Resp>({ exists: false }, 404);
      }
      return c.json<Resp>({ exists: true, guid: user.guid, id: user.id }, 200);
    },
  )

  .post(
    "/",
    zValidator("json", CreateUserSchema),
    zValidator("header", z.object({ Authorization: z.string().jwt() })),
    async (c) => {
      const guid = await getGUID(c);
      const body = c.req.valid("json");
      const header = c.req.valid("header");

      const id = crypto.randomUUID();

      const defaultEmail = await getEmailFromIDToken(header.Authorization);
      if (body.customEmail) {
        await verification.register(c, id, body.name, body.customEmail);
      }

      const newUser = await prisma.user.create({
        data: {
          id,
          guid,
          imageUrl: body.imageUrl,
          name: body.name,
          gender: body.gender,
          isForeignStudent: body.isForeignStudent,
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
          allowPeriodicNotifications: body.allowPeriodicNotifications,
          learningLanguages: {
            create: body.learningLanguageIds.map((langId) => ({
              languageId: langId,
            })),
          },
          defaultEmail,
          customEmail: body.customEmail,
        },
      });
      return c.json(newUser);
    },
  );

export default router;
