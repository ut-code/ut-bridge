import type { Prisma } from "@prisma/client";
import { PrismaClient } from "@prisma/client";

let log: Prisma.LogDefinition[] = [];
if (process.env.SQL_LOGS === "true") {
  log = [
    {
      emit: "event",
      level: "query",
    },
    {
      emit: "stdout",
      level: "error",
    },
    {
      emit: "stdout",
      level: "info",
    },
    {
      emit: "stdout",
      level: "warn",
    },
  ];
}

const omit: Prisma.PrismaClientOptions["omit"] = {
  user: {
    defaultEmail: true,
    customEmail: true,
    allowNotifications: true,
    allowPeriodicNotifications: true,
  },
};

export const prisma = new PrismaClient({
  log,
  omit,
});
