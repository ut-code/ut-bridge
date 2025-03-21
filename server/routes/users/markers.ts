// favorite + block

import { zValidator } from "@hono/zod-validator";
import { type Marker, MarkerSchema } from "common/zod/schema.ts";
import { Hono } from "hono";
import { z } from "zod";
import { type AuthenticatedContext, getUserID } from "../../auth/func.ts";
import { prisma } from "../../config/prisma.ts";

async function mark(c: AuthenticatedContext, kind: Marker, targetId: string) {
  const actorId = await getUserID(c);
  return c.json(
    await prisma.marker.upsert({
      where: {
        actorId_targetId: {
          actorId,
          targetId,
        },
      },
      update: {
        kind,
      },
      create: { kind, actorId, targetId },
    }),
    201,
  );
}

async function unmark(c: AuthenticatedContext, kind: Marker, targetId: string) {
  const actorId = await getUserID(c);
  try {
    await prisma.marker.delete({
      where: {
        actorId_targetId: { actorId, targetId },
        kind,
      },
    });
    return c.body(null, 204);
  } catch {
    return c.body(null, 404);
  }
}

const route = new Hono()
  .put(
    "/favorite/:targetId",
    zValidator("header", z.object({ Authorization: z.string() })),
    zValidator("param", z.object({ targetId: z.string().uuid() })),
    async (c) => {
      const { targetId } = c.req.valid("param");
      return await mark(c, "favorite", targetId);
    },
  )
  .put(
    "/blocked/:targetId",
    zValidator("header", z.object({ Authorization: z.string() })),
    zValidator("param", z.object({ targetId: z.string().uuid() })),
    async (c) => {
      const { targetId } = c.req.valid("param");
      return await mark(c, "blocked", targetId);
    },
  )
  .delete(
    "/favorite/:targetId",
    zValidator("header", z.object({ Authorization: z.string() })),
    zValidator("param", z.object({ targetId: z.string().uuid() })),
    async (c) => {
      const { targetId } = c.req.valid("param");
      return await unmark(c, "favorite", targetId);
    },
  )
  .delete(
    "/blocked/:targetId",
    zValidator("header", z.object({ Authorization: z.string() })),
    zValidator("param", z.object({ targetId: z.string().uuid() })),
    async (c) => {
      const { targetId } = c.req.valid("param");
      return await unmark(c, "blocked", targetId);
    },
  )
  // delete many
  .delete(
    "/",
    zValidator(
      "query",
      z.object({
        targetId: z.string().uuid().optional(),
        kind: MarkerSchema.optional(),
      }),
    ),
    zValidator("header", z.object({ Authorization: z.string() })),
    async (c) => {
      const actorId = await getUserID(c);
      const { targetId, kind } = c.req.valid("query");
      await prisma.marker.deleteMany({
        where: {
          actorId,
          targetId,
          kind,
        },
      });
      return c.body(null, 204);
    },
  );
export default route;
