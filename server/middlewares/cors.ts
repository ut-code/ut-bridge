import { cors as hono_cors } from "hono/cors";
import { env } from "../lib/env.js";

const cors = () =>
  hono_cors({
    origin: (origin, c) => {
      if (
        env(c, "CORS_ALLOW_ORIGINS")
          .split(",")
          .some((o) => o === origin)
      ) {
        return origin;
      }
      let suffix = env(c, "CORS_ALLOW_SUFFIX", { fallback: "" });
      if (suffix === "") return null;
      if (!suffix.startsWith(".")) {
        suffix = `.${suffix}`;
      }
      if (origin.endsWith(suffix)) {
        return origin;
      }
      return null;
    },
    credentials: true,
  });

export default cors;
