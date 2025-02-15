import { panic } from "common/lib/panic.ts";
import type { Context } from "hono";
import { env as hono_env } from "hono/adapter";

export function env(c: Context, name: string): string {
  return hono_env(c)[name] ?? panic(`Environment variable not found: ${name}`);
}
