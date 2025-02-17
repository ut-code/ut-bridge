import { Hono } from "hono";
import { PrismaClient } from "@prisma/client"

const prisma = PrismaClient();

const router = new Hono();

router.get("/", async (c) => {
  const users = await prisma.user.findMany()

  return c.json(users)
})

router.get("/:id", async(c) => {
  const id = c.req.param('id')
  const user = await prisma.user.findUnique({
    where: {
      id: id
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

router.put("/", async (c) => {
  const updateContent = await c.req.json()
  const updatedUser = await prisma.user.update({
    where: {
      id: updateContent.id
    },
    data: updateContent
  })
  return c.json(updatedUser)
});

router.delete("/", async (c) => {
  const body = await c.req.json()
  const deletedUser = await prisma.user.delete({
    where: { id: body.id }
  })
  return c.json(deletedUser)
});

export default router;