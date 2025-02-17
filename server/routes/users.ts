import { Hono } from "hono";
import { PrismaClient } from "@prisma/client"

const prisma = PrismaClient();

const router = new Hono();

router.get("/", async (c) => {
  const users = await prisma.user.findMany()

  return c.json(users)
})

router.get("/:id", async(c) => {
  const userId = c.req.param("id")
  const user = await prisma.user.findUnique({
    where: {
      id: userId
    }
  })
  return c.json(user)
});

router.post("/", async (c) => {
  const body = await c.req.json
  const newUser = await prisma.user.create({
    data: body
  })
  return c.json(newUser)
});

router.put("/:id", async (c) => {
  const userId = c.req.param("id")
  const updateContent = await c.req.json()
  const updatedUser = await prisma.user.update({
    where: {
      id: userId
    },
    data: updateContent
  })
  return c.json(updatedUser)
});

router.delete("/:id", async (c) => {
  const userId = c.req.param("id")
  const deletedUser = await prisma.user.delete({
    where: { id: userId }
  })
  return c.json(deletedUser)
});

export default router;