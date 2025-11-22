// app/api/auth/me/route.ts
import { NextResponse } from "next/server";

const API_BASE = process.env.NEXT_PUBLIC_PROD_BACKEND_URL;

export async function GET(req: Request) {
  try {
    const cookieHeader = req.headers.get("cookie") || "";

    const res = await fetch(`${API_BASE}/api/v1/me`, {
      method: "GET",
      headers: {
        Cookie: cookieHeader,
        Accept: "application/json",
      },
      // no 'credentials' here because it's server -> server fetch
    });

    const text = await res.text();
    // forward status & body
    return new NextResponse(text, {
      status: res.status,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err: any) {
    return new NextResponse(JSON.stringify({ error: err.message }), {
      status: 500,
    });
  }
}
