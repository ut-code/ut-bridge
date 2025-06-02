import type { Context } from "hono";
import { env } from "../../lib/env.ts";
import { type MailOptions, sendEmail } from "../internal/mailer.ts";
import { EMAIL_SUFFIX_CONTACT } from "../internal/prefixes.ts";

export async function sendVerificationEmail(
  c: Context,
  user: {
    name: string;
    email: string;
  },
  verificationId: string,
  token: string,
) {
  const WEB_ORIGIN = env(c, "WEB_ORIGIN");
  const url = `${WEB_ORIGIN}/verify?id=${verificationId}&token=${token}`;

  const body = `
Visit this page to verify your email: <a href="${url}">${url}</a>

${EMAIL_SUFFIX_CONTACT}
`;

  const options: MailOptions = {
    to: [user],
    subject: "Verify your email for UT-Bridge",
    body,
  };

  console.log("[verification] sent verification email", options);
  await sendEmail(c, options);
}
