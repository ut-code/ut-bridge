import { Hono } from "hono";
import { type MailOptions, sendEmail } from "./index.ts";
// Message object
const message: MailOptions = {
  to: ["Internal <internal@utcode.net>"],
  subject: "[ut-bridge] Nodemailer test √", // title
  body: `<h1>Hello!</h1>
  <p>ut-bridge mailing test.</p>
  <a href="https://utcode.net">links</a>`,
};

const app = new Hono().get("/", async (c) => {
  await sendEmail(c, message);
});

app.request("/");
