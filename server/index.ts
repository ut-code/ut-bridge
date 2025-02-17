import { Hono } from "hono";
import cors from "./middlewares/cors";
import usersRoutes from "./routes/users";

const app = new Hono().use(cors("CORS_ALLOW_ORIGINS"))

app.get("/", (c) => c.text("Hello from Hono 🔥"));

app.route("/users", usersRoutes);

export default app;
export type App = typeof app;
