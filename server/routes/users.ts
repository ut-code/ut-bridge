import { PrismaClient } from "@prisma/client";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { UserSchema } from "../zod/schema";
import { Hono } from "hono";

const prisma = new PrismaClient();

const router = new Hono()

  .get("/", async (c) => {
    const users = await prisma.user.findMany();

    return c.json(users);
  })

  .get("/:id",
    zValidator("param", z.object({ id: z.string() })),
    async (c) => {
    const userId = c.req.valid("param").id;
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
    return c.json(user);
  })

  .post("/",
    zValidator("json", UserSchema),
    async (c) => {
    const body = c.req.valid("json");
    const newUser = await prisma.user.create({
      data: body,
    });
    const result = UserSchema.safeParse(newUser);
    return c.json(result.data);
  })

  .put("/:id",
    zValidator("param", z.object({ id: z.string() })),
    async (c) => {
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

  .delete("/:id",
    zValidator("param", z.object({ id: z.string() })),
    async (c) => {
    const userId = c.req.valid("param").id;
    const deletedUser = await prisma.user.delete({
      where: { id: userId },
    });
    return c.json(deletedUser);
  });

export default router;
