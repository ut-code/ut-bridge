import type { Context } from "hono";
import { env as hono_env } from "hono/adapter";

export function env(c: Context, name: string): string {
  return hono_env(c)[name] ?? panic(`Environment variable not found: ${name}`);
}

export function panic(message: string): never {
  throw new Error(message);
}
