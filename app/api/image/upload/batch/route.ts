import { NextRequest, NextResponse } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import crypto from "crypto";

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

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData();
    const folder = form.get("folder")?.toString() || "uploads";

    const files = form.getAll("file") as File[];
    if (!files.length) {
      return NextResponse.json({ error: "No files received" }, { status: 400 });
    }

    const uploadedUrls: string[] = [];

    for (const file of files) {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const sha = crypto.createHash("sha256").update(buffer).digest("hex");
      const ext = file.name.split(".").pop();
      const filename = `${sha}.${ext}`;

      const path = `${folder}/${filename}`;

      // Upload ke Supabase Storage (via S3-compatible API)
      await client.send(
        new PutObjectCommand({
          Bucket: process.env.SUPABASE_S3_BUCKET!,
          Key: path,
          Body: buffer,
          ContentType: file.type,
        })
      );

      // Public URL final
      const publicUrl =
        `${process.env.SUPABASE_S3_PUBLIC_URL}/storage/v1/object/public/` +
        `${process.env.SUPABASE_S3_BUCKET}/${path}`;

      uploadedUrls.push(publicUrl);
    }

    return NextResponse.json(uploadedUrls); // <= RETURN HANYA ARRAY URL
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
