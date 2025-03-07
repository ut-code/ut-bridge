import { hc } from "hono/client";
import type { App } from "server";
import { panic } from "server/lib/env";

export const API_ENDPOINT = process.env.NEXT_PUBLIC_API_ENDPOINT ?? panic("env NEXT_PUBLIC_API_ENDPOINT not found");

console.log("API_ENDPOINT:", API_ENDPOINT);
export const client = hc<App>(API_ENDPOINT, {
  init: {
    credentials: "include",
  },
});
