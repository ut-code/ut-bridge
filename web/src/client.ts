import { hc } from "hono/client";
import type { App } from "server";
import { panic } from "server/lib/env";

export const client = hc<App>(
  process.env.NEXT_PUBLIC_API_ENDPOINT ??
    panic("env NEXT_PUBLIC_API_ENDPOINT not found"),
);
