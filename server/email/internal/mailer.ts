import type { Context } from "hono";
import { env, env_bool } from "../../lib/env.ts";

type APIStructure = {
  subject: string;
  sender: { name: string; email: string };
  type?: string;
  htmlContent: string;
  to: { email: string }[];
};

function createBody(to: { name: string; email: string }[], subject: string, body: string): APIStructure {
  return {
    subject,
    sender: { name: "UT-Bridge", email: "contact@utcode.net" },
    type: "classic",
    htmlContent: body,
    to,
  };
}

export async function send(
  to: { name: string; email: string }[],
  subject: string,
  body: string,
  env: {
    apiKey: string;
  },
) {
  const resp = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      "api-key": env.apiKey,
      "content-type": "application/json",
    },
    body: JSON.stringify(createBody(to, subject, body)),
  });
  console.log(await resp.text());
}

export type MailOptions = {
  to: { name: string; email: string }[];
  subject: string;
  /** HTML */
  body: string;
};
export async function sendEmail(c: Context, options: MailOptions) {
  const ZERO_EMAIL = env_bool(c, "ZERO_EMAIL", false);
  if (ZERO_EMAIL) {
    console.log("[email] skipped sending email to", options.to, "with body", options.body);
    return;
  }
  return await send(options.to, options.subject, options.body, {
    apiKey: env(c, "MAILING_BREVO_API_KEY"),
  });
}
