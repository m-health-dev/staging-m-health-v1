import { NextRequest, NextResponse } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { createClient } from "@/utils/supabase/server";

async function sha256(input: ArrayBuffer) {
  const hashBuffer = await crypto.subtle.digest("SHA-256", input);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData();
    const file = form.get("file") as File;
    const model = form.get("model")?.toString() || "default";
    // const field = form.get("field")?.toString() || "file";

    if (!file) {
      return NextResponse.json({ error: "File is required" }, { status: 400 });
    }

    const buffer = await file.arrayBuffer();
    const mimeType = file.type;
    const originalExt = file.name.split(".").pop()?.toLowerCase() || "dat";

    // 🔥 Generate SHA-256 as the file name
    const hash = await sha256(buffer);
    const hashedFileName = `${hash}.${originalExt}`;

    // Tentukan folder upload
    const key = `${model}/${hashedFileName}`;

    // S3 Client (Supabase S3 Gateway)
    const client = new S3Client({
      region: process.env.SUPABASE_S3_REGION || "us-east-1",
      endpoint: process.env.SUPABASE_S3_ENDPOINT!,
      credentials: {
        accessKeyId: process.env.SUPABASE_S3_ACCESS_KEY!,
        secretAccessKey: process.env.SUPABASE_S3_SECRET_KEY!,
      },
      forcePathStyle: true,
    });

    await client.send(
      new PutObjectCommand({
        Bucket: process.env.SUPABASE_S3_BUCKET!,
        Key: key,
        Body: Buffer.from(buffer),
        ContentType: mimeType,
      })
    );

    const publicUrl = `${
      process.env.SUPABASE_S3_PUBLIC_URL
    }/storage/v1/object/public/${process.env.SUPABASE_S3_BUCKET!}/${key}`;

    return NextResponse.json({
      success: true,
      url: publicUrl,
      filename: hashedFileName,
      path: key,
    });
  } catch (err) {
    console.error("Upload error:", err);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
