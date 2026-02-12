import { NextRequest, NextResponse } from "next/server";
import { S3Client, DeleteObjectsCommand } from "@aws-sdk/client-s3";

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
 */
function extractS3Key(inputPath: string): string {
  const bucket = process.env.SUPABASE_S3_BUCKET!;

  let cleaned = inputPath;
  try {
    const url = new URL(inputPath);
    cleaned = url.pathname;
  } catch {
    // Not a full URL
  }

  const storagePrefix = `/storage/v1/object/public/${bucket}/`;
  const idx = cleaned.indexOf(storagePrefix);
  if (idx !== -1) {
    return cleaned.substring(idx + storagePrefix.length);
  }

  if (cleaned.startsWith(`/${bucket}/`)) {
    return cleaned.substring(bucket.length + 2);
  }
  if (cleaned.startsWith(`${bucket}/`)) {
    return cleaned.substring(bucket.length + 1);
  }

  return cleaned.startsWith("/") ? cleaned.substring(1) : cleaned;
}

export async function DELETE(req: NextRequest) {
  const { paths } = await req.json();

  if (!paths || !Array.isArray(paths) || paths.length === 0) {
    return NextResponse.json({ error: "No paths provided" }, { status: 400 });
  }

  try {
    const keys = paths.map((p) => extractS3Key(p));

    await client.send(
      new DeleteObjectsCommand({
        Bucket: process.env.SUPABASE_S3_BUCKET!,
        Delete: {
          Objects: keys.map((key) => ({ Key: key })),
        },
      }),
    );

    return NextResponse.json({
      message: "Multiple files deleted successfully",
    });
  } catch (err: any) {
    // If objects don't exist, treat as success
    if (
      err.name === "NoSuchKey" ||
      err.Code === "NoSuchKey" ||
      err.$metadata?.httpStatusCode === 404
    ) {
      return NextResponse.json({
        message: "Multiple files deleted successfully",
      });
    }

    console.error("Batch delete failed:", err);
    return NextResponse.json({ error: "Batch delete failed" }, { status: 500 });
  }
}
