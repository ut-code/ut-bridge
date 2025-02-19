import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { z } from "zod";
import { prisma } from "../config/prisma";
import { UserSchema } from "../zod/schema";

const router = new Hono()

  .get("/", async (c) => {
    const users = await prisma.user.findMany();

    return c.json(users);
  })

  .get("/:id", zValidator("param", z.object({ id: z.string() })), async (c) => {
    const userId = c.req.valid("param").id;
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
    return c.json(user);
  })

  .post("/", zValidator("json", UserSchema), async (c) => {
    const body = c.req.valid("json");
    const newUser = await prisma.user.create({
      data: body,
    });
    return c.json(newUser);
  })

  .put("/:id", zValidator("param", z.object({ id: z.string() })), async (c) => {
    const userId = c.req.valid("param").id;
    const updateContent = await c.req.json();
    const updatedUser = await prisma.user.update({
      where: {
        id: userId,
      },
      data: updateContent,
    });
    return c.json(updatedUser);
  })

  .delete(
    "/:id",
    zValidator("param", z.object({ id: z.string() })),
    async (c) => {
      const userId = c.req.valid("param").id;
      const deletedUser = await prisma.user.delete({
        where: { id: userId },
      });
      return c.json(deletedUser);
    },
  );

export default router;
