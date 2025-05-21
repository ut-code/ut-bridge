import type { Context } from "hono";
import { env } from "../../lib/env.ts";
import { type MailOptions, sendEmail } from "../internal/mailer.ts";

export async function sendVerificationEmail(
  c: Context,
  user: {
    name: string;
    email: string;
  },
  verificationId: string,
) {
  const WEB_ORIGIN = env(c, "WEB_ORIGIN");
  const url = `${WEB_ORIGIN}/verify?id=${verificationId}`;

  const options: MailOptions = {
    to: [user],
    subject: "Verify your email",
    body: `Click the link to verify your email: <a href="${url}">${url}</a>`,
  };

  console.log("[verification] sent verification email", options);
  await sendEmail(c, options);
}
