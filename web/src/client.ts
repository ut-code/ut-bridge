import { hc } from "hono/client";
import type { App } from "server";

export const client = hc<App>(
  process.env.NEXT_PUBLIC_API_ENDPOINT || "default_api_endpoint",
);
