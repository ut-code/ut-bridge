import { Hono } from "hono";

const app = new Hono().get("/", (c) => {
	return c.text("Hello from Hono!");
});

export default app;
export type App = typeof app;
