import type { Context } from "hono";
import { HTTPException } from "hono/http-exception";
import { prisma } from "../../config/prisma.ts";
import { env_bool } from "../../lib/env.ts";
import { sendVerificationEmail } from "./utils.ts";

const VERIFICATION_CHANNEL = (verificationId: string) => `verification:${verificationId}`;

export function subscribe(verificationId: string, cb: () => void) {
  const bc = new BroadcastChannel(VERIFICATION_CHANNEL(verificationId));
  bc.onmessage = (event) => {
    if (event.data !== "email verified") {
      console.error("[verification] unexpected message", event.data);
      return;
    }
    cb();
  };

  return () => {
    bc.close();
  };
}

const VERIFICATION_EMAIL_TTL = 60 * 60 * 1000; // 60 minutes

/**
 * Register a new email verification.
 * @returns verification id
 */
export async function register(c: Context, userId: string, userName: string, email: string) {
  const ZERO_EMAIL = env_bool(c, "ZERO_EMAIL", false);

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

  await sendVerificationEmail(c, { name: userName, email }, verification.id, verification.token);

  if (ZERO_EMAIL) {
    setTimeout(() => {
      verify(verification.id, verification.token);
    }, 5000);
  }
  return verification.id;
}

export async function verify(verificationId: string, token: string) {
  const verification = await prisma.emailVerification.findUnique({
    where: { id: verificationId, token },
  });
  if (!verification) {
    throw new HTTPException(400, {
      message: `verification ${verificationId} not found`,
    });
  }
  console.log("[verification] verified email", verification.email);
  await prisma.user.update({
    where: {
      id: verification.userId,
    },
    data: {
      customEmail: verification.email,
    },
  });

  // Notify listeners that verification is complete
  const bc = new BroadcastChannel(VERIFICATION_CHANNEL(verificationId));
  bc.postMessage("email verified");
  bc.close();

  // clean up no-longer-necessary ones from same user
  await prisma.emailVerification.deleteMany({
    where: { userId: verification.userId },
  });

  // GC completely unrelated fields (too old to be verified anymore)
  await prisma.emailVerification.deleteMany({
    where: { createdAt: { lt: new Date(Date.now() - VERIFICATION_EMAIL_TTL) } },
  });
}
