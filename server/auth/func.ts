import type { Context } from "hono";
import { HTTPException } from "hono/http-exception";
import { prisma } from "../config/prisma.ts";
import { auth } from "./config.ts";

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
  const idToken = c.req.valid("header")?.Authorization;
  if (idToken) return await getGUIDFromIDToken(idToken);

  const query = c.req.query("id-token");
  if (query) return await getGUIDFromIDToken(query);

  throw new HTTPException(401, {
    message: "header Authorization not found",
  });
}

export async function getUserID(c: AuthenticatedContext) {
  const guid = await getGUID(c);
  const user = await prisma.user.findUnique({
    where: { guid },
    select: {
      id: true,
    },
  });
  if (!user) throw new HTTPException(404, { message: "User not found" });
  return user.id;
}
