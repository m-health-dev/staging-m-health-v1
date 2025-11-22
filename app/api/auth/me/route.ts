import { NextResponse, type NextRequest } from "next/server";

const apiBaseUrl = process.env.NEXT_PUBLIC_PROD_BACKEND_URL;

export async function GET(request: NextRequest) {
  try {
    const cookie = request.headers.get("cookie") ?? "";

    console.log("[v0] Auth ME - Forwarding cookie:", cookie?.slice(0, 50));
    console.log("[v0] Backend URL:", apiBaseUrl);

    // Step 1: Get CSRF token (required by Sanctum)
    const csrfRes = await fetch(`${apiBaseUrl}/sanctum/csrf-cookie`, {
      method: "GET",
      credentials: "include",
      headers: {
        Accept: "application/json",
      },
    });

    if (!csrfRes.ok) {
      console.error("[v0] CSRF fetch failed:", csrfRes.status);
    }

    // Step 2: Get user data with cookies
    const res = await fetch(`${apiBaseUrl}/api/v1/me`, {
      method: "GET",
      headers: {
        Cookie: cookie,
        Accept: "application/json",
        "X-Requested-With": "XMLHttpRequest", // Required by Sanctum
      },
      credentials: "include",
    });

    console.log("[v0] User data response:", res.status);

    if (res.status === 401) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    if (!res.ok) {
      const errorText = await res.text();
      console.error("[v0] Failed to fetch user:", res.status, errorText);
      return NextResponse.json(
        { authenticated: false, error: "Failed to fetch user" },
        { status: 500 }
      );
    }

    const user = await res.json();
    console.log("[v0] User fetched successfully:", user?.email || user?.id);

    const response = NextResponse.json({ authenticated: true, user });

    const setCookieHeaders = csrfRes.headers.getSetCookie?.() || [];
    const userSetCookies = res.headers.getSetCookie?.() || [];
    [...setCookieHeaders, ...userSetCookies].forEach((cookie) => {
      response.headers.append("Set-Cookie", cookie);
    });

    return response;
  } catch (error) {
    console.error("[v0] Auth ME error:", error);
    return NextResponse.json(
      { authenticated: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
