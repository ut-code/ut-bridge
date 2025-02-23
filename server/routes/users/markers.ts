import { zValidator } from "@hono/zod-validator";
import { type Context, Hono } from "hono";
import { z } from "zod";
import { getUserID } from "../../auth/func.ts";
import { prisma } from "../../config/prisma.ts";

const MarkerKindSchema = z.enum(["block", "favorite"]);
type MarkerKind = z.infer<typeof MarkerKindSchema>;

async function mark(c: Context, kind: MarkerKind, targetId: string) {
  const actorId = await getUserID(c);
  return c.json(
    await prisma.marker.create({
      data: { kind, actorId, targetId },
    }),
    201,
  );
}
async function unmark(c: Context, kind: MarkerKind, targetId: string) {
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
    zValidator("param", z.object({ targetId: z.string().uuid() })),
    async (c) => {
      const { targetId } = c.req.valid("param");
      return await mark(c, "favorite", targetId);
    },
  )
  .put(
    "/block/:targetId",
    zValidator("param", z.object({ targetId: z.string().uuid() })),
    async (c) => {
      const { targetId } = c.req.valid("param");
      return await mark(c, "block", targetId);
    },
  )
  .delete(
    "/favorite/:targetId",
    zValidator("param", z.object({ targetId: z.string().uuid() })),
    async (c) => {
      const { targetId } = c.req.valid("param");
      return await unmark(c, "favorite", targetId);
    },
  )
  .delete(
    "/block/:targetId",
    zValidator("param", z.object({ targetId: z.string().uuid() })),
    async (c) => {
      const { targetId } = c.req.valid("param");
      return await unmark(c, "block", targetId);
    },
  )
  // delete many
  .delete(
    "/",
    zValidator(
      "query",
      z.object({
        targetId: z.string().uuid().optional(),
        kind: MarkerKindSchema.optional(),
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
