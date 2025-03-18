import type { Context } from "hono";
import { env as hono_env } from "hono/adapter";

export function env(c: Context, name: string, options?: { fallback?: string }): string {
  return hono_env(c)[name] ?? options?.fallback ?? panic(`Environment variable not found: ${name}`);
}

export function panic(message: string): never {
  throw new Error(message);
}
