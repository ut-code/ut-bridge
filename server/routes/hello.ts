import { Hono } from "hono";
import usersRoutes from "./users"

const app = new Hono();

app.get("/", (c) => c.text("Hello from Hono 🔥"));

app.route('/users', usersRoutes)

export default app;
