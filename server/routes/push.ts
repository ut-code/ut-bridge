import { Hono } from "hono";
import webpush from "web-push";

const vapidKeys = webpush.generateVAPIDKeys();

export function publish() {
  "todo";
}
const route = new Hono().get("/pub_key", async (c) => {
  return c.json({ pubkey: vapidKeys.publicKey });
});
export default route;
