import { NextRequest, NextResponse } from "next/server";
import { S3Client, DeleteObjectCommand } from "@aws-sdk/client-s3";

export const runtime = "nodejs";

const client = new S3Client({
  region: process.env.SUPABASE_S3_REGION || "us-east-1",
  endpoint: process.env.SUPABASE_S3_ENDPOINT!,
  credentials: {
    accessKeyId: process.env.SUPABASE_S3_ACCESS_KEY!,
    secretAccessKey: process.env.SUPABASE_S3_SECRET_KEY!,
  },
  forcePathStyle: true,
});

/**
 * Extract the actual S3 key from various path formats.
 * Handles full URLs, paths with /storage/v1/object/public/{bucket}/ prefix, etc.
 */
function extractS3Key(inputPath: string): string {
  const bucket = process.env.SUPABASE_S3_BUCKET!;

  // Strip full URL prefix if present (e.g. https://xxx.supabase.co/storage/v1/...)
  let cleaned = inputPath;
  try {
    const url = new URL(inputPath);
    cleaned = url.pathname;
  } catch {
    // Not a full URL, continue with the raw path
  }

  // Strip /storage/v1/object/public/{bucket}/ prefix
  const storagePrefix = `/storage/v1/object/public/${bucket}/`;
  const idx = cleaned.indexOf(storagePrefix);
  if (idx !== -1) {
    return cleaned.substring(idx + storagePrefix.length);
  }

  // Strip /{bucket}/ prefix
  if (cleaned.startsWith(`/${bucket}/`)) {
    return cleaned.substring(bucket.length + 2);
  }
  if (cleaned.startsWith(`${bucket}/`)) {
    return cleaned.substring(bucket.length + 1);
  }

  // Remove leading slash if present
  return cleaned.startsWith("/") ? cleaned.substring(1) : cleaned;
}

export async function DELETE(req: NextRequest) {
  const { path } = await req.json();

  if (!path) {
    return NextResponse.json({ error: "No path provided" }, { status: 400 });
  }

  const key = extractS3Key(path);

  try {
    await client.send(
      new DeleteObjectCommand({
        Bucket: process.env.SUPABASE_S3_BUCKET!,
        Key: key,
      }),
    );

    return NextResponse.json({ message: "Deleted successfully" });
  } catch (err: any) {
    // If the object doesn't exist, treat as success — goal is deletion
    if (
      err.name === "NoSuchKey" ||
      err.Code === "NoSuchKey" ||
      err.$metadata?.httpStatusCode === 404
    ) {
      return NextResponse.json({ message: "Deleted successfully" });
    }

    console.error("Delete failed:", err);
    return NextResponse.json(
      { error: `Delete failed. ${err}` },
      { status: 500 },
    );
  }
}
