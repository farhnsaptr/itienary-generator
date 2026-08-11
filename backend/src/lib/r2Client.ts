import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { env } from "../config/env";
import crypto from "crypto";

export const r2Client = new S3Client({
  region: "auto",
  endpoint: `https://${env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: env.R2_ACCESS_KEY_ID,
    secretAccessKey: env.R2_SECRET_ACCESS_KEY,
  },
});

/**
 * Upload buffer file to Cloudflare R2 bucket.
 * Returns public URL and the R2 object key.
 */
export async function uploadToR2(
  fileBuffer: Buffer,
  mimeType: string,
  folder: string = "uploads"
): Promise<{ url: string; key: string }> {
  const extension = mimeType.split("/")[1] || "bin";
  const uniqueId = crypto.randomBytes(16).toString("hex");
  const key = `${folder}/${Date.now()}-${uniqueId}.${extension}`;

  const command = new PutObjectCommand({
    Bucket: env.R2_BUCKET_NAME,
    Key: key,
    Body: fileBuffer,
    ContentType: mimeType,
  });

  await r2Client.send(command);

  // Construct public URL
  const publicBaseUrl = env.R2_PUBLIC_URL.endsWith("/")
    ? env.R2_PUBLIC_URL.slice(0, -1)
    : env.R2_PUBLIC_URL;
  const url = `${publicBaseUrl}/${key}`;

  return { url, key };
}

/**
 * Delete object from Cloudflare R2 bucket by key.
 */
export async function deleteFromR2(key: string): Promise<void> {
  if (!key) return;

  const command = new DeleteObjectCommand({
    Bucket: env.R2_BUCKET_NAME,
    Key: key,
  });

  await r2Client.send(command);
}
