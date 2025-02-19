import type { Prisma } from "@prisma/client";
import { PrismaClient } from "@prisma/client";

const config: Prisma.PrismaClientOptions = {};

if (process.env.SQL_LOGS === "true") {
  config.log = [
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

export const prisma = new PrismaClient(config);
