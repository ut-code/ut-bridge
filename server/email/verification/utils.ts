import type { Context } from "hono";
import { env } from "../../lib/env.ts";
import { sendEmail } from "../internal/mailer.ts";

export async function sendVerificationEmail(
  c: Context,
  user: {
    name: string;
    email: string;
  },
  verificationId: string,
) {
  const WEB_ORIGIN = env(c, "WEB_ORIGIN");
  const url = `${WEB_ORIGIN}/verify/${verificationId}`;

  await sendEmail(c, {
    to: [user],
    subject: "Verify your email",
    body: `Click the link to verify your email: <a href="${url}">${url}</a>`,
  });
}
