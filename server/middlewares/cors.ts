import type { Context, Next } from "hono";
import { cors as hono_cors } from "hono/cors";
import { env } from "../lib/env";

const cors = (env_var: string) => (c: Context, next: Next) =>
  hono_cors({
    origin: env(c, env_var).split(","),
  })(c, next);

export default cors;
