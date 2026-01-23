import { NextResponse } from "next/server";
// The client you created from the Server-Side Auth instructions
import { createClient } from "@/utils/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  // if "next" is in param, use it as the redirect URL
  let next = searchParams.get("next") ?? "/";
  if (!next.startsWith("/")) {
    // if "next" is not a relative URL, use the default
    next = "/";
  }

  console.log("OAuth callback received, exchanging code for session:", {
    code,
    next,
  });

  if (code) {
    const supabase = await createClient();
    const { data: exchange, error } =
      await supabase.auth.exchangeCodeForSession(code);
    if (error || !exchange?.session) {
      return NextResponse.redirect(`${origin}/auth/error`);
    }
    const { data, error: set } = await supabase.auth.setSession({
      access_token: exchange.session.access_token,
      refresh_token: exchange.session.refresh_token,
    });
    if (!set) {
      const forwardedHost = request.headers.get("x-forwarded-host"); // original origin before load balancer
      const isLocalEnv = process.env.NODE_ENV === "development";
      if (isLocalEnv) {
        // we can be sure that there is no load balancer in between, so no need to watch for X-Forwarded-Host
        return NextResponse.redirect(`${origin}${next}`);
      } else if (forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}${next}`);
      } else {
        return NextResponse.redirect(`${origin}${next}`);
      }
    }
  }

  // return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/auth/error`);
}
