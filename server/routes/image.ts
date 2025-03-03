import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { createPresignedPost } from "@aws-sdk/s3-presigned-post";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { Hono } from "hono";

// Cloudflare R2 の S3 設定
const accessKeyId = process.env.CLOUDFLARE_R2_ACCESS_KEY;
const secretAccessKey = process.env.CLOUDFLARE_R2_SECRET_KEY;

if (!accessKeyId || !secretAccessKey) {
  throw new Error("Missing Cloudflare R2 credentials");
}

const s3 = new S3Client({
  region: "auto",
  endpoint: "https://c692d351b94b9f1f32c04143499cba82.r2.cloudflarestorage.com",
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
});

const router = new Hono()
  .get("/", async (c) => {
    const key = c.req.query("key");

    const command = new GetObjectCommand({
      Bucket: "ut-bridge",
      Key: key,
    });

    // 署名付きURLを生成（有効期限 7 day）
    const url = await getSignedUrl(s3, command, {
      expiresIn: 60 * 60 * 24 * 7,
    });

    return c.json({ url });
  })
  .get("/upload", async (c) => {
    const fileName = `uploads/${Date.now()}-${Math.random()
      .toString(36)
      .slice(2)}`;

    const { url, fields } = await createPresignedPost(s3, {
      Bucket: "ut-bridge",
      Key: fileName,
      Conditions: [["content-length-range", 0, 10 * 1024 * 1024]], // 10MBまで許可
      Expires: 600,
    });

    return c.json({ url, fields, fileName });
  })
  .put("/", async (c) => {
    const key = c.req.query("key");

    const command = new PutObjectCommand({
      Bucket: "ut-bridge",
      Key: key,
    });

    // 署名付きURLを生成（有効期限 7 day）
    const url = await getSignedUrl(s3, command, {
      expiresIn: 60 * 60 * 24 * 7,
    });

    return c.json({ url });
  });

export default router;
