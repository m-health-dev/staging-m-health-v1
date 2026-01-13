import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

const getBaseUrl = (): string => {
  // Always prioritize environment variable for production
  if (process.env.NEXT_PUBLIC_BASE_URL) {
    return process.env.NEXT_PUBLIC_BASE_URL;
  }
  // Fallback for development
  return "http://localhost:3030";
};

export async function GET(request: Request) {
  // The `/auth/callback` route is required for the server-side auth flow implemented
  // by the SSR package. It exchanges an auth code for the user's session.
  // https://supabase.com/docs/guides/auth/server-side/nextjs
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const origin = getBaseUrl();
  const redirectTo = requestUrl.searchParams.get("redirect")?.toString();

  if (code) {
    const supabase = await createClient();
    const { data: checkCode } = await supabase.auth.exchangeCodeForSession(
      code
    );
    console.log("Success Exchange Code!");
  }

  if (redirectTo) {
    return NextResponse.redirect(`${origin}${redirectTo}`);
  }

  // URL to redirect to after sign up process completes
  return NextResponse.redirect(`${origin}/en/dashboard`);
}
