import type { Message } from "@prisma/client";
import type { Context } from "hono";
import { prisma } from "../config/prisma.ts";
import { sendEmail } from "./internal/mailer.ts";

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
  if (receiver.email) {
    if (
      receiver.lastNotificationSentAt &&
      Date.now() - receiver.lastNotificationSentAt.getTime() < EMAIL_THROTTLE_INTERVAL_MS
    ) {
      // email throttled
      return;
    }
    await prisma.user.update({
      where: { id: toId },
      data: { lastNotificationSentAt: new Date() },
    });
    await sendEmail(c, {
      to: [{ name: receiver.name, email: receiver.email }],
      subject: `New message from ${fromName}`,
      body: message.content, // TODO: escape the HTML content
    });
  }
}
