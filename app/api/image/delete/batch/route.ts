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

export async function DELETE(req: NextRequest) {
  const { paths } = await req.json();

  if (!paths || !Array.isArray(paths) || paths.length === 0) {
    return NextResponse.json({ error: "No paths provided" }, { status: 400 });
  }

  try {
    await client.send(
      new DeleteObjectsCommand({
        Bucket: process.env.SUPABASE_S3_BUCKET!,
        Delete: {
          Objects: paths.map((key) => ({ Key: key })),
        },
      })
    );

    return NextResponse.json({
      message: "Multiple files deleted successfully",
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Batch delete failed" }, { status: 500 });
  }
}
