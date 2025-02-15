import { Hono } from "hono";

const route = new Hono().get("/", (c) => c.text("Hello from Hono 🔥"));

export default route;
