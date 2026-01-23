import { type EmailOtpType } from "@supabase/supabase-js";
import { type NextRequest, NextResponse } from "next/server";

import { createClient } from "@/utils/supabase/server";

const getOrigin = (request: NextRequest): string => {
  const { origin } = new URL(request.url);
  const forwardedHost = request.headers.get("x-forwarded-host");
  const isLocalEnv = process.env.NODE_ENV === "development";

  // In production with nginx/load balancer, use x-forwarded-host
  if (!isLocalEnv && forwardedHost) {
    return `https://${forwardedHost}`;
  }

  // Fallback to environment variable or request origin
  if (process.env.NEXT_PUBLIC_BASE_URL) {
    return process.env.NEXT_PUBLIC_BASE_URL;
  }

  return origin;
};

// Creating a handler to a GET request to route /auth/confirm
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const next = "/dashboard";
  const origin = getOrigin(request);

  if (token_hash && type) {
    const supabase = await createClient();

    const { data: verify, error } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    });

    if (error || !verify?.session) {
      return NextResponse.redirect(`${origin}/auth/error`);
    }
    const { data, error: set } = await supabase.auth.setSession({
      access_token: verify.session.access_token,
      refresh_token: verify.session.refresh_token,
    });

    if (!set) {
      console.log("Success Login!");
      return NextResponse.redirect(`${origin}${next}`);
    }

    console.error("Set session error:", set.message);
    return NextResponse.redirect(
      `${origin}/sign-in?error=${encodeURIComponent(set.message)}`,
    );
  }

  // return the user to an error page with some instructions
  return NextResponse.redirect(`${origin}/sign-in?error=invalid_token`);
}
