import { PrismaClient } from "@prisma/client";
import { zValidator } from "@hono/zod-validator";
import { UserSchema } from "../zod/schema";
import { Hono } from "hono";

const prisma = new PrismaClient();

const router = new Hono()

  .get("/", async (c) => {
    const users = await prisma.user.findMany();

    return c.json(users);
  })

  .get("/:id", async (c) => {
    const userId = c.req.param("id");
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
    const result = UserSchema.safeParse(user);
    return c.json(result.data);
  })

  .post("/", zValidator("json", UserSchema), async (c) => {
    const body = await c.req.json();
    const newUser = await prisma.user.create({
      data: body,
    });
    const result = UserSchema.safeParse(newUser);
    return c.json(result.data);
  })

  .put("/:id", async (c) => {
    const userId = c.req.param("id");
    const updateContent = await c.req.json();
    const updatedUser = await prisma.user.update({
      where: {
        id: userId,
      },
      data: updateContent,
    });
    const result = UserSchema.safeParse(updatedUser);
    return c.json(result.data);
  })

  .delete("/:id", async (c) => {
    const userId = c.req.param("id");
    const deletedUser = await prisma.user.delete({
      where: { id: userId },
    });
    const result = UserSchema.safeParse(deletedUser);
    return c.json(result.data);
  });

export default router;
