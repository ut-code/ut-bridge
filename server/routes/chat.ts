import { zValidator } from "@hono/zod-validator";
import { randomUUIDv7 } from "bun";
import { stringify } from "devalue";
import { Hono } from "hono";
import { streamSSE } from "hono/streaming";
import z from "zod";
import { prisma } from "../config/prisma.ts";

import { MESSAGE_MAX_LENGTH, type Message } from "common/zod/schema.ts";
import { HTTPException } from "hono/http-exception";
import { getUserID } from "../auth/func.ts";
import { onMessageSend } from "../email/hooks/onMessageSend.ts";
const router = new Hono()
  // # general paths
  // ## about room
  .post(
    "/rooms",
    zValidator(
      "json",
      z.object({
        name: z.string().optional(),
        pictureUrl: z.string().optional(),
        members: z.array(z.string()),
      }),
    ),
    zValidator("header", z.object({ Authorization: z.string() })),
    async (c) => {
      const { members, ...room } = c.req.valid("json");
      const { id: roomId } = await prisma.room.create({
        data: {
          ...room,
        },
        select: { id: true },
      });
      await prisma.belongs.createMany({
        data: members.map((member) => ({
          roomId,
          userId: member,
        })),
      });
      return c.json({ id: roomId }, 201);
    },
  )
  .put(
    "/rooms/:room",
    zValidator("param", z.object({ room: z.string() })),
    zValidator("json", z.object({ name: z.string() })),
    zValidator("header", z.object({ Authorization: z.string() })),
    async (c) => {
      const userId = await getUserID(c);
      const roomId = c.req.valid("param").room;
      try {
        await prisma.room.update({
          where: {
            id: roomId,
            members: {
              some: {
                userId: userId,
              },
            },
          },
          data: c.req.valid("json"),
        });
        return c.json({ ok: true }, 200);
      } catch (err) {
        return c.json({ error: "room not found" }, 404);
      }
    },
  )
  .post(
    "/rooms/:room/members",
    zValidator("param", z.object({ room: z.string() })),
    zValidator("header", z.object({ Authorization: z.string() })),
    zValidator(
      "json",
      z.object({
        member: z.string(),
      }),
    ),
    async (c) => {
      const userId = await getUserID(c);
      const { room: roomId } = c.req.valid("param");
      const resp = await prisma.belongs.findUnique({
        where: { userId_roomId: { userId, roomId } },
        select: {},
      });
      if (!resp)
        throw new HTTPException(401, {
          message: "you don't belong to the room",
        });

      await prisma.belongs.create({
        data: {
          roomId,
          userId: c.req.valid("json").member,
        },
      });
      return c.json({ ok: true }, 201);
    },
  )
  .delete(
    "/rooms/:room/members/:member",
    zValidator("param", z.object({ room: z.string(), member: z.string() })),
    zValidator("header", z.object({ Authorization: z.string() })),
    async (c) => {
      const userId = await getUserID(c);
      const param = c.req.valid("param");
      const resp = await prisma.belongs.findUnique({
        where: { userId_roomId: { userId, roomId: param.room } },
        select: {},
      });
      if (!resp)
        throw new HTTPException(401, {
          message: "you don't belong to the room",
        });
      try {
        await prisma.belongs.delete({
          where: {
            userId_roomId: {
              userId: param.member,
              roomId: param.room,
            },
          },
        });
        return c.json({ ok: true }, 200);
      } catch (err) {
        return c.json({ error: "member not found" }, 404);
      }
    },
  )
  /**
   * Delete a chat room and all its associated data
   *
   * This endpoint allows a room member to delete the entire chat room.
   * It will:
   * 1. Verify the requesting user is a member of the room
   * 2. Delete the room (which cascades to messages and memberships due to foreign key constraints)
   * 3. Broadcast a DeleteRoom event to all room members
   *
   * @route DELETE /rooms/:room
   * @param room - The ID of the room to delete
   * @returns {Object} Success status
   * @throws {HTTPException} 404 - If room not found or user is not a member
   * @throws {HTTPException} 500 - If room deletion fails
   */
  .delete(
    "/rooms/:room",
    zValidator("param", z.object({ room: z.string() })),
    zValidator("header", z.object({ Authorization: z.string() })),
    async (c) => {
      const userId = await getUserID(c);
      const { room: roomId } = c.req.valid("param");

      // Verify user is a member of the room to prevent unauthorized deletion
      const membership = await prisma.belongs.findUnique({
        where: { userId_roomId: { userId, roomId } },
        select: { roomId: true },
      });

      if (!membership) {
        throw new HTTPException(404, { message: "Room not found or access denied" });
      }

      // Get all room members before deletion so we can notify them
      const roomMembers = await prisma.belongs.findMany({
        where: { roomId },
        select: { userId: true },
      });
      const memberIds = roomMembers.map((member) => member.userId);

      try {
        // Delete the room - this will cascade to messages and memberships
        await prisma.room.delete({
          where: { id: roomId },
        });

        // Notify all room members that the room was deleted
        broadcast(memberIds, {
          event: "DeleteRoom",
          data: devalue({ roomId }),
        });

        return c.json({ ok: true }, 200);
      } catch (err) {
        console.error("Failed to delete room:", err);
        throw new HTTPException(500, { message: "Failed to delete room" });
      }
    },
  )
  // ## room preview
  .get("/rooms/preview", zValidator("header", z.object({ Authorization: z.string() })), async (c) => {
    const requester = await getUserID(c);
    const resp = await prisma.room.findMany({
      where: {
        members: {
          some: {
            userId: requester,
          },
        },
        NOT: {
          members: {
            some: {
              user: {
                markedAs: {
                  some: {
                    actorId: requester,
                    kind: "blocked",
                  },
                },
              },
            },
          },
        },
        messages: {
          some: {
            id: {},
          },
        },
      },
      select: {
        id: true,
        members: {
          select: {
            user: {
              select: {
                id: true,
                name: true,
                imageUrl: true,
              },
            },
          },
        },
        messages: {
          select: {
            content: true,
          },
          take: 1,
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });

    return c.json(
      resp.map((it) => ({
        ...it,
        lastMessage: it.messages[0]?.content ?? null,
        messages: undefined,
      })),
      200,
    );
  })
  // ## room data
  .get(
    "/rooms/dmwith/:user",
    zValidator("param", z.object({ user: z.string() })),
    zValidator("header", z.object({ Authorization: z.string() })),
    async (c) => {
      const meId = await getUserID(c);
      const { user } = c.req.valid("param");
      const rooms = await prisma.room.findMany({
        where: {
          AND: [
            {
              members: {
                every: {
                  OR: [{ userId: user }, { userId: meId }],
                },
              },
            },
            {
              members: {
                some: { userId: user },
              },
            },
            {
              members: {
                some: { userId: meId },
              },
            },
          ],
          NOT: {
            members: {
              some: {
                user: {
                  markedAs: {
                    some: {
                      actorId: user,
                      kind: "blocked",
                    },
                  },
                },
              },
            },
          },
        },
        select: {
          id: true,
        },
      });
      return c.json(rooms);
    },
  )
  .get(
    "/rooms/:room",
    zValidator("header", z.object({ Authorization: z.string() })),
    zValidator(
      "param",
      z.object({
        room: z.string().uuid(), // Room ID
      }),
    ),
    async (c) => {
      const { room: roomId } = c.req.valid("param");
      const requester = await getUserID(c);
      const resp = await prisma.room.findUnique({
        where: {
          id: roomId,
          members: {
            some: {
              userId: requester,
            },
          },
          NOT: {
            members: {
              some: {
                user: {
                  markedAs: {
                    some: {
                      actorId: requester,
                      kind: "blocked",
                    },
                  },
                },
              },
            },
          },
        },
        select: {
          id: true,
          name: true,
          members: {
            select: {
              user: {
                select: {
                  id: true,
                  name: true,
                  imageUrl: true,
                },
              },
            },
          },
          messages: {
            include: {
              sender: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
      });
      if (!resp) throw new HTTPException(404, { message: "room not found" });
      return c.json(resp, 200);
    },
  )
  // # IO: client -> server
  .post(
    "/rooms/:room/messages",
    zValidator(
      "param",
      z.object({
        room: z.string().uuid(),
      }),
    ),
    zValidator("header", z.object({ Authorization: z.string() })),
    zValidator(
      "json",
      z.object({
        isPhoto: z.boolean(),
        content: z.string().max(MESSAGE_MAX_LENGTH, { message: `メッセージは${MESSAGE_MAX_LENGTH}文字以下です` }),
      }),
    ),
    async (c) => {
      const requester = await getUserID(c);
      // TODO(AUTH): make sure requester is in the room
      const { room: roomId } = c.req.valid("param");
      const json = c.req.valid("json");

      const message = {
        ...json,
        roomId,
        id: randomUUIDv7(),
        senderId: requester,
        isEdited: false,
        createdAt: new Date(),
      };
      (async () => {
        const receivers = prisma.belongs
          .findMany({
            where: { roomId },
            select: {
              userId: true,
            },
          })
          .then((result) => result.map((it) => it.userId));
        const sender = await prisma.user.findUnique({
          where: { id: requester },
          select: { name: true },
        });
        if (!sender) throw new HTTPException(404, { message: "you don't seem to exist" });

        // broadcast SSE
        broadcast(await receivers, {
          event: "Create",
          data: devalue({
            message: {
              ...message,
              sender,
            },
          }),
        });

        // broadcast mails
        for (const receiverId of await receivers) {
          if (receiverId !== requester) {
            await onMessageSend(c, {
              fromName: sender.name,
              inRoomId: roomId,
              toId: receiverId,
              message,
            });
          }
        }
      })();
      const resp = await prisma.message.create({
        data: {
          ...message,
        },
      });
      return c.json(resp, 201);
    },
  )
  .patch(
    "/messages/:message",
    zValidator(
      "param",
      z.object({
        message: z.string().uuid(), // Message ID
      }),
    ),
    zValidator(
      "json",
      z.object({
        content: z.string().max(MESSAGE_MAX_LENGTH, { message: `メッセージは${MESSAGE_MAX_LENGTH}文字以下です` }),
      }),
    ),
    zValidator("header", z.object({ Authorization: z.string() })),
    async (c) => {
      const requester = await getUserID(c);
      // TODO(AUTH): make sure requester is in the room
      const { message: messageId } = c.req.valid("param");
      const json = c.req.valid("json");

      let updated: { roomId: string };
      try {
        updated = await prisma.message.update({
          where: { id: messageId, senderId: requester },
          data: { content: json.content, isEdited: true },
          select: { roomId: true },
        });
      } catch (err) {
        return c.json({ error: "previous message not found" }, 404);
      }

      const receivers = (
        await prisma.belongs.findMany({
          where: { roomId: updated.roomId },
          select: {
            userId: true,
          },
        })
      ).map((it) => it.userId);

      broadcast(receivers, {
        event: "Update",
        data: devalue({
          id: messageId,
          message: {
            content: json.content,
          },
        }),
      });
      return c.json({ ok: true }, 201);
    },
  )
  .delete(
    "/messages/:message/:room",
    zValidator(
      "param",
      z.object({
        message: z.string().uuid(), // Message ID
        room: z.string().uuid(),
      }),
    ),
    zValidator("header", z.object({ Authorization: z.string() })),
    async (c) => {
      const requester = await getUserID(c);
      const { message: messageId, room } = c.req.valid("param");

      let deleted: { roomId: string };
      try {
        deleted = await prisma.message.delete({
          where: { id: messageId, senderId: requester, roomId: room },
          select: { roomId: true },
        });
      } catch (err) {
        return c.json({ error: "previous message not found" }, 404);
      }

      const receivers = (
        await prisma.belongs.findMany({
          where: { roomId: deleted.roomId },
          select: {
            userId: true,
          },
        })
      ).map((it) => it.userId);

      broadcast(receivers, {
        event: "Delete",
        data: devalue({
          id: messageId,
        }),
      });
      return c.json({ ok: true }, 201);
    },
  )

  // IO: server -> client
  .get("/sse", async (c) => {
    const userId = await getUserID(c);
    return streamSSE(c, async (stream) => {
      let connected = true;
      const bc = new BroadcastChannel(`chat:${userId}`);

      bc.onmessage = (_e) => {
        const ev: BroadcastEvent = _e.data;
        stream.writeSSE(ev);
      };

      stream.onAbort(() => {
        connected = false;
        bc.close();
      });

      while (connected) {
        const pingEvent: BroadcastEvent = {
          event: "Ping",
          data: "",
        };
        stream.writeSSE(pingEvent);
        await Bun.sleep(5000);
      }
    });
  });

export function devalue<T>(data: T) {
  return stringify(data) as Devalue<T>;
}
export type Devalue<T> = string & {
  type: T;
};

export type BroadcastEvent<T extends string = string> = BroadcastEvents & {
  event: T;
};
type BroadcastEvents =
  | {
      event: "Create";
      data: Devalue<{
        message: Message;
      }>;
    }
  | {
      event: "Update";
      data: Devalue<{
        id: string;
        message: {
          content: string;
        };
      }>;
    }
  | {
      event: "Delete";
      data: Devalue<{
        id: string;
      }>;
    }
  | {
      event: "DeleteRoom";
      data: Devalue<{
        roomId: string;
      }>;
    }
  | {
      event: "Ping";
      data: "";
    };

type UserID = string;
function broadcast<T extends string>(to: UserID[], event: BroadcastEvent<T>) {
  for (const id of to) {
    const bc = new BroadcastChannel(`chat:${id}`);
    bc.postMessage(event);
    bc.close();
  }
}

export default router;
