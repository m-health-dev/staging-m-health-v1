import LocalDateTime from "@/components/utility/lang/LocaleDateTime";
import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

// export const runtime = "edge";

// Image metadata
export const alt = "M HEALTH Opengraph Image";
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get("title") || "M HEALTH";
  const description =
    searchParams.get("description") || "M HEALTH Official Website";

  const path = searchParams.get("path") || "PT. Medika Integrasi Persada";

  const manropeBold = await readFile(
    join(process.cwd(), "public/fonts/Manrope-Bold.ttf")
  );

  const manropeRegular = await readFile(
    join(process.cwd(), "public/fonts/Manrope-Regular.ttf")
  );

  const logoUrl =
    "https://hoocfkzapbmnldwmedrq.supabase.co/storage/v1/object/public/m-health-public/static/mhealth_logo.PNG";

  // Fetch image as ArrayBuffer
  const logoRes = await fetch(logoUrl);
  const buffer = await logoRes.arrayBuffer();

  // Convert to BASE64
  const base64 = Buffer.from(buffer).toString("base64");
  const mime = "image/png";
  const dataUrl = `data:${mime};base64,${base64}`;

  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 60,
          fontWeight: "bold",
          color: "#3e77ab",
          background: "white",
          width: "100%",
          height: "100%",
          padding: "60px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          alignItems: "flex-start",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            gap: "10px",
          }}
        >
          <img
            src={dataUrl}
            style={{
              width: "200px",
              height: "150px",
              objectFit: "contain",
              marginTop: "-20px",
            }}
          />
          <div
            style={{
              color: "#3e77ab",
              fontSize: "50px",
              fontWeight: "extra-bold",
            }}
          >
            {title}
          </div>
          <div
            style={{
              marginTop: "40px",
              color: "#30b878",
              fontSize: "32px",
              lineHeight: "1.4",
              fontWeight: "normal",
            }}
          >
            {description.slice(0, 200)}
          </div>
        </div>
        <div
          style={{
            marginTop: "40px",
            color: "gray",
            fontSize: "32px",
            lineHeight: "1.4",
            fontWeight: "normal",
          }}
        >
          {path}
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: "Manrope",
          data: manropeBold,
          style: "normal",
          weight: 700,
        },
        {
          name: "Manrope",
          data: manropeRegular,
          style: "normal",
          weight: 400,
        },
      ],
    }
  );
}
