import type { Message } from "@prisma/client";
import type { Context } from "hono";
import { prisma } from "../../config/prisma.ts";
import { env_bool } from "../../lib/env.ts";
import { sendEmail } from "../internal/mailer.ts";
import { EMAIL_SUFFIX_CONTACT } from "../internal/prefixes.ts";

const EMAIL_THROTTLE_INTERVAL_MS = 10 * 60 * 1000; // 10 minutes

export async function onMessageSend(c: Context, fromName: string, toId: string, message: Message) {
  const receiver = await prisma.user.findUnique({
    where: { id: toId },
    select: {
      id: true,
      name: true,
      email: true,
      lastNotificationSentAt: true,
    },
  });
  if (!receiver) {
    console.error(`user ${toId} not found`);
    return;
  }

  const subject = `[UT-Bridge] New message from ${fromName}`;
  // TODO: switch the message based on:
  // - if it's first message or not
  // - user's selected language
  const body = `
New message arrived from ${fromName}:
${escapeHTML(message.content)}

${EMAIL_SUFFIX_CONTACT}
`;

  if (
    receiver.lastNotificationSentAt &&
    Date.now() - receiver.lastNotificationSentAt.getTime() < EMAIL_THROTTLE_INTERVAL_MS
  ) {
    // email throttled
    console.log(`[email engine] email throttled:
subject: "${subject}"
body: "${body}"`);
    return;
  }
  await prisma.user.update({
    where: { id: toId },
    data: { lastNotificationSentAt: new Date() },
  });

  if (!receiver.email || env_bool(c, "ZERO_EMAIL", false)) {
    console.log(
      `
[email engine] skipped sending email to ${receiver.name} <${receiver.email ?? "no address registered"}>:
subject: "${subject}"
body: "${body}"`,
    );
    return;
  }

  await sendEmail(c, {
    to: [{ name: receiver.name, email: receiver.email }],
    subject,
    body,
  });
}

const suspiciousChars = [
  ["&", "&amp;"],
  ["'", "&#x27;"],
  ["`", "&#x60;"],
  ['"', "&quot;"],
  ["<", "&lt;"],
  [">", "&gt;"],
] as const;

function escapeHTML(input: string) {
  let result = input;

  for (const [from, to] of suspiciousChars) {
    result = result.replaceAll(from, to);
  }
  return result;
}
