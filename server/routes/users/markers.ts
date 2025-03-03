// favorite + block

import { vValidator } from "@hono/valibot-validator";
import { type Marker, MarkerSchema } from "common/validation/schema.ts";
import { type Context, Hono } from "hono";
import * as v from "valibot";
import { getUserID } from "../../auth/func.ts";
import { prisma } from "../../config/prisma.ts";

async function mark(c: Context, kind: Marker, targetId: string) {
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

async function unmark(c: Context, kind: Marker, targetId: string) {
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
  .put("/favorite/:targetId", vValidator("param", v.object({ targetId: v.pipe(v.string(), v.uuid()) })), async (c) => {
    const { targetId } = c.req.valid("param");
    return await mark(c, "favorite", targetId);
  })
  .put("/blocked/:targetId", vValidator("param", v.object({ targetId: v.pipe(v.string(), v.uuid()) })), async (c) => {
    const { targetId } = c.req.valid("param");
    return await mark(c, "blocked", targetId);
  })
  .delete(
    "/favorite/:targetId",
    vValidator("param", v.object({ targetId: v.pipe(v.string(), v.uuid()) })),
    async (c) => {
      const { targetId } = c.req.valid("param");
      return await unmark(c, "favorite", targetId);
    },
  )
  .delete(
    "/blocked/:targetId",
    vValidator("param", v.object({ targetId: v.pipe(v.string(), v.uuid()) })),
    async (c) => {
      const { targetId } = c.req.valid("param");
      return await unmark(c, "blocked", targetId);
    },
  )
  // delete many
  .delete(
    "/",
    vValidator(
      "query",
      v.object({
        targetId: v.optional(v.pipe(v.string(), v.uuid())),
        kind: v.optional(MarkerSchema),
      }),
    ),
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
