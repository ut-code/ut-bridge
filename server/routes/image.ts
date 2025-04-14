import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { z } from "zod";

// Cloudflare R2 の S3 設定
const accessKeyId = process.env.CLOUDFLARE_R2_ACCESS_KEY;
const secretAccessKey = process.env.CLOUDFLARE_R2_SECRET_KEY;
const userImageDomain = process.env.USER_IMAGE_DOMAIN;

if (!accessKeyId || !secretAccessKey || !userImageDomain) {
  throw new Error("Missing Cloudflare R2 credentials");
}

const s3 = new S3Client({
  region: "auto",
  endpoint: "https://df6c3acd32f66bd1eb95e50607684297.r2.cloudflarestorage.com/ut-bridge-user-image",
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
});

const router = new Hono()
  .get("/get", zValidator("query", z.object({ key: z.string() })), async (c) => {
    const key = c.req.valid("query").key;
    const url = `${userImageDomain}/${key}`;

    return c.json({ url });
  })
  .get("/put", async (c) => {
    const fileName = `uploads/${Date.now()}-${Math.random().toString(36).slice(2)}`;

    const url = await getSignedUrl(
      s3,
      // TODO(security): limit Content-Length to 10MB
      new PutObjectCommand({
        Bucket: "ut-bridge-user-image",
        Key: fileName,
        // Conditions: // [["content-length-range", 0, 10 * 1024 * 1024]], // 10MBまで許可
        // Expires: 600,
      }),
      {
        expiresIn: 10 * 60 * 1000,
      },
    );

    console.log(url);
    return c.json({ url, fileName });
  });

export default router;
