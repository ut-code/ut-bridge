import type { Context } from "hono";
import { HTTPException } from "hono/http-exception";
import { prisma } from "../../config/prisma.ts";
import { env_bool } from "../../lib/env.ts";
import { sendVerificationEmail } from "./utils.ts";

const VERIFY_EMAIL_AGE = 60 * 60 * 1000; // 60 minutes

export async function register(c: Context, userId: string, userName: string, email: string) {
  if (env_bool(c, "ZERO_EMAIL")) {
    await prisma.user.update({
      where: { id: userId },
      data: {
        email,
      },
    });
    return;
  }

  const verification = await prisma.emailVerification.upsert({
    where: { userId },
    create: {
      userId,
      email,
    },
    update: {
      email,
    },
  });

  await sendVerificationEmail(c, { name: userName, email }, verification.id);
}

export async function verify(id: string) {
  const verification = await prisma.emailVerification.findUnique({
    where: { id },
  });
  if (!verification) {
    throw new HTTPException(400, {
      message: `verification ${id} not found`,
    });
  }
  console.log("[verification] verified email", verification.email);
  await prisma.user.update({
    where: {
      id: verification.userId,
    },
    data: {
      email: verification.email,
    },
  });
  await prisma.emailVerification.delete({
    where: { id },
  });

  // clean up no-longer-necessary ones
  await prisma.emailVerification.deleteMany({
    where: { userId: verification.userId },
  });

  // GC completely unrelated fields
  await prisma.emailVerification.deleteMany({
    where: { createdAt: { lt: new Date(Date.now() - VERIFY_EMAIL_AGE) } },
  });
}
