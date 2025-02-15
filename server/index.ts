import { Hono } from "hono";
import hello from "./routes/hello";
import { cors } from "hono/cors";

const app = new Hono()
	.use(
		cors({
			origin: [process.env.CORS_ALLOW_ORIGINS],
		}),
	)
	.route("/", hello);

export default app;
export type App = typeof app;
