import type { Context } from "hono";
import { env as hono_env } from "hono/adapter";

export function env(c: Context, name: string, options?: { fallback?: string }): string {
  return hono_env(c)[name] ?? options?.fallback ?? panic(`Environment variable not found: ${name}`);
}

export function env_int(c: Context, name: string, options?: { fallback?: string }): number {
  const val = env(c, name, options);
  const parsed = Number.parseInt(val);
  if (Number.isNaN(parsed)) throw new Error(`[env_int] expected int-parsable value, got ${val}`);
  return parsed;
}

export function env_bool(c: Context, name: string, options?: { fallback?: string }): boolean {
  const val = env(c, name, options);
  switch (val.toLowerCase()) {
    case "1":
    case "true":
    case "t":
    case "yes":
    case "y":
      return true;
    case "0":
    case "false":
    case "f":
    case "no":
    case "n":
      return false;
    default:
      throw new Error(`[env_bool] expected bool-castable value, got "${val}"`);
  }
}

export function panic(message: string): never {
  throw new Error(message);
}
