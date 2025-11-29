import createIntlMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { updateSession } from "./utils/supabase/middleware";
import { NextRequest, NextResponse } from "next/server";

const intlMiddleware = createIntlMiddleware(routing);

export async function proxy(request: NextRequest) {
  const sessionResponse = await updateSession(request);

  if (sessionResponse.redirected || sessionResponse.status === 302) {
    return sessionResponse;
  }

  const intlResponse = intlMiddleware(request) as NextResponse;

  sessionResponse.cookies.getAll().forEach((cookie) => {
    intlResponse.cookies.set(cookie);
  });

  return intlResponse;
}

export const config = {
  matcher: "/((?!api|coming-soon|trpc|_next|_vercel|auth|.*\\..*).*)",
};
