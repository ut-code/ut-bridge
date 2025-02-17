import { Hono } from "hono";

const router = new Hono();

router.get("/", (c) => {});

router.post("/", (c) => {});
router.put("/", (c) => {});
router.delete("/", (c) => {});

export default router