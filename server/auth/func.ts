import type { Context } from "hono";
import { getSignedCookie, setSignedCookie } from "hono/cookie";
import { HTTPException } from "hono/http-exception";
import { prisma } from "../config/prisma.ts";
import { panic } from "../lib/env.ts";
import { auth } from "./config.ts";

const __COOKIE_SIGN_SECRET = process.env.COOKIE_SIGN_SECRET ?? panic("env COOKIE_SIGN_SECRET not found");
const COOKIE_SIGN =
  // shuffle cookie sign on development to prevent stale data fucking up the cache
  process.env.NODE_ENV === "development" ? Math.random().toString() : __COOKIE_SIGN_SECRET;
if (process.env.NODE_ENV === "development") {
  console.log("using custom COOKIE_SIGN:", COOKIE_SIGN);
}

export async function getGUIDFromIDToken(token: string) {
  return (await auth.verifyIdToken(token)).uid;
}

export type AuthenticatedContext = Context<
  // biome-ignore lint: it defaults to any
  any,
  string,
  {
    in: {
      header: {
        Authorization: string;
      };
    };
    out: {
      header: {
        Authorization: string;
      };
    };
  }
>;

export async function getGUID(c: AuthenticatedContext) {
  const idToken = c.req.valid("header").Authorization;
  if (idToken) return await getGUIDFromIDToken(idToken);

  const cookie = c.req.query("id-token");
  if (cookie) return await getGUIDFromIDToken(cookie);

  throw new HTTPException(401, {
    message: "header Authorization not found",
  });
}

export async function getUserID(c: AuthenticatedContext) {
  const cached = await getSignedCookie(c, COOKIE_SIGN, "ut-bridge-Userid-Cache");
  if (cached) return cached;

  const guid = await getGUID(c);
  const user = await prisma.user.findUnique({
    where: { guid },
    select: {
      id: true,
    },
  });
  if (!user) throw new HTTPException(404, { message: "User not found" });
  await setSignedCookie(c, "ut-bridge-Userid-Cache", user.id, COOKIE_SIGN);

  return user.id;
}
