import { NextRequest, NextResponse } from "next/server";

/**
 * Custom header name that the frontend must send with every internal API call.
 * This blocks tools like Postman / curl / other sites that don't include it.
 */
export const API_INTERNAL_HEADER = "x-mhealth-internal";

/**
 * The value the custom header must carry. It is NOT a secret (it ships in
 * client JS), but it raises the bar against casual abuse. True security comes
 * from the origin check below.
 */
export const API_INTERNAL_VALUE = "1";

/**
 * Allowed origins derived from NEXT_PUBLIC_BASE_URL.
 * Covers both http and https, with and without www, plus localhost for dev.
 */
function getAllowedOrigins(): string[] {
  const base = process.env.NEXT_PUBLIC_BASE_URL || "";
  const origins: string[] = [];

  if (base) {
    origins.push(base);

    // Also allow without trailing slash
    origins.push(base.replace(/\/$/, ""));

    // Allow www variant
    try {
      const url = new URL(base);
      if (!url.hostname.startsWith("www.")) {
        origins.push(`${url.protocol}//www.${url.host}`);
      } else {
        origins.push(
          `${url.protocol}//${url.hostname.replace(/^www\./, "")}${url.port ? ":" + url.port : ""}`,
        );
      }
    } catch {
      // ignore parse errors
    }
  }

  // Always allow localhost in development
  if (process.env.NODE_ENV !== "production") {
    origins.push("http://localhost:3000");
    origins.push("http://localhost:3001");
    origins.push("http://127.0.0.1:3000");
  }

  return origins;
}

/**
 * Validate that an incoming API request originates from the site itself.
 *
 * Returns `null` when the request is allowed, or a `NextResponse` (403)
 * when it should be blocked.
 *
 * Checks performed:
 * 1. Origin or Referer header must match an allowed origin.
 * 2. The custom `x-mhealth-internal` header must be present.
 *
 * Server-side calls (no Origin / Referer) are allowed because they already
 * run in a trusted environment (e.g. Next.js server components calling
 * their own API routes).
 */
export function validateInternalRequest(
  request: NextRequest,
): NextResponse | null {
  const origin = request.headers.get("origin");
  const referer = request.headers.get("referer");

  // Server-side requests (SSR / server actions) have no origin/referer.
  // They are trusted — allow them through.
  const isServerSide = !origin && !referer;
  if (isServerSide) return null;

  const allowed = getAllowedOrigins();

  // Check Origin header
  const originAllowed = origin
    ? allowed.some((o) => origin.startsWith(o))
    : false;

  // Fallback: check Referer header
  const refererAllowed = referer
    ? allowed.some((o) => referer.startsWith(o))
    : false;

  if (!originAllowed && !refererAllowed) {
    return NextResponse.json(
      { error: "Forbidden: invalid origin" },
      { status: 403 },
    );
  }

  // Check custom header (blocks curl / Postman / simple cross-origin GETs)
  const internalHeader = request.headers.get(API_INTERNAL_HEADER);
  if (internalHeader !== API_INTERNAL_VALUE) {
    return NextResponse.json(
      { error: "Forbidden: missing internal header" },
      { status: 403 },
    );
  }

  return null; // Request is valid
}
