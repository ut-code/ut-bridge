import { zValidator } from "@hono/zod-validator";
import { MarkerSchema, type StructuredCardUser } from "common/zod/schema.ts";
import { Hono } from "hono";
import { getUserID } from "server/auth/func.ts";
import z from "zod";
import { getCommunityUsers } from "../query/community.ts";

const router = new Hono().get(
  "/",
  zValidator(
    "query",
    z.object({
      except: z.string().optional(),
      page: z.coerce.number().default(1),
      exchangeQuery: z.enum(["exchange", "japanese", "all"]).default("all"),
      searchQuery: z.string().default(""),
      marker: z.union([MarkerSchema, z.literal("notBlocked")]).optional(),
      wantsToMatch: z.enum(["true"]).optional(),
    }),
  ),
  zValidator("header", z.object({ Authorization: z.string(), sessionSeed: z.string() })),
  async (c) => {
    const requester = await getUserID(c);
    const header = c.req.valid("header");
    const query = c.req.valid("query");

    const { users, totalUsers } = await getCommunityUsers(requester, query, header.sessionSeed);

    return c.json({ users: users satisfies StructuredCardUser[], totalUsers });
  },
);

export default router;
