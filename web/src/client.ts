import { hc } from "hono/client";
import type { App } from "server";
import { env } from "./lib/env";

export const client = hc<App>(env("NEXT_PUBLIC_API_ENDPOINT"));
