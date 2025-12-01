import { NextRequest, NextResponse } from "next/server";
import { S3Client, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { createClient } from "@/utils/supabase/server";

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

export async function DELETE(req: NextRequest) {
  const { path } = await req.json();

  if (!path) {
    return NextResponse.json({ error: "No path provided" }, { status: 400 });
  }

  try {
    await client.send(
      new DeleteObjectCommand({
        Bucket: process.env.SUPABASE_S3_BUCKET!,
        Key: path,
      })
    );

    return NextResponse.json({ message: "Deleted successfully" });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}
