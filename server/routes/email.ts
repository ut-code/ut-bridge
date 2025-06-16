import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { streamSSE } from "hono/streaming";
import z from "zod";
import { getUserID } from "../auth/func.ts";
import { prisma } from "../config/prisma.ts";
import { register, subscribe, verify } from "../email/verification/func.ts";

const route = new Hono()
  .put(
    "/register",
    zValidator("query", z.object({ email: z.string() })),
    zValidator("header", z.object({ Authorization: z.string() })),
    async (c) => {
      const params = c.req.valid("query");
      const userId = await getUserID(c);
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { name: true },
      });
      if (!user) throw new HTTPException(404, { message: "user not found" });

      const verificationId = await register(c, userId, user.name, params.email);
      return c.json({ ok: true, verificationId });
    },
  )
  .put(
    "/verify",
    zValidator(
      "query",
      z.object({
        id: z.string(),
        token: z.string(),
      }),
    ),
    async (c) => {
      const params = c.req.valid("query");
      await verify(params.id, params.token);
      return c.json({ ok: true });
    },
  )
  .get(
    "/wait-for-verification",
    zValidator(
      "query",
      z.object({
        verificationId: z.string(),
      }),
    ),
    async (c) => {
      return streamSSE(c, async (stream) => {
        const params = c.req.valid("query");
        const unsub = subscribe(params.verificationId, async () => {
          await stream.writeSSE({
            event: "verify",
            data: JSON.stringify({ verified: true }),
          });
        });
        stream.onAbort(() => {
          unsub();
        });
        while (true) {
          await Bun.sleep(8000);
          await stream.writeSSE({
            event: "ping",
            data: "ping",
          });
        }
      });
    },
  )
  .delete("/custom", zValidator("header", z.object({ Authorization: z.string() })), async (c) => {
    const userId = await getUserID(c);

    await prisma.user.update({
      where: { id: userId },
      data: { customEmail: null },
    });

    return c.json({ ok: true });
  });

export default route;
