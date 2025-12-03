import { NextResponse } from "next/server";
import { geolocation, ipAddress } from "@vercel/functions";

export const runtime = "edge";

export async function GET(request: Request) {
  const headers = new Headers(request.headers);
  if (process.env.NODE_ENV === "development") {
    // Mock data for development
    return NextResponse.json({
      ip: "127.0.0.1",
      geo: {
        vcity: "Batu",
        vcountry: "Indonesia",
        vlatitude: "0",
        vlongitude: "0",
        vregion: "East Java",
        cfcity: "Batu",
        cfcountry: "Indonesia",
        cflatitude: "0",
        cflongitude: "0",
        cfregion: "East Java",
      },
    });
  }

  // Production code (same as before)
  const ip = ipAddress(request) ?? "Unknown";
  const geo = geolocation(request) ?? {};

  const country = headers.get("CF-IPCountry") || "Unknown";
  const city = headers.get("CF-IPCity") || "Unknown";
  const latitude = headers.get("CF-IPLatitude") || "Unknown";
  const longitude = headers.get("CF-IPLongitude") || "Unknown";
  const ray = headers.get("CF-Ray") || "Unknown";

  // Try to get the IP from Cloudflare headers
  let cfIp = headers.get("CF-Connecting-IP");

  // If Cloudflare header is not available, fall back to other methods
  if (!cfIp) {
    cfIp =
      headers.get("X-Forwarded-For")?.split(",")[0] ||
      headers.get("X-Real-IP") ||
      cfIp ||
      "Unknown";
  }

  return NextResponse.json({
    ip,
    geo: {
      vcity: geo.city ?? "Unknown",
      vcountry: geo.country ?? "Unknown",
      vlatitude: geo.latitude ?? "Unknown",
      vlongitude: geo.longitude ?? "Unknown",
      vregion: geo.region ?? "Unknown",
      cfip: cfIp ?? "unknown",
      cfcity: city ?? "Unknown",
      cfcountry: country ?? "Unknown",
      cflatitude: latitude ?? "Unknown",
      cflongitude: longitude ?? "Unknown",
      cfray: ray ?? "Unknown",
    },
  });
}
