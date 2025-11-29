import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing"; // Sesuaikan path import
import { type NextRequest } from "next/server";
import { updateSession } from "./utils/supabase/middleware"; // Sesuaikan path import

const handleI18nRouting = createMiddleware(routing);

export async function proxy(request: NextRequest) {
  // 1. Jalankan middleware next-intl.
  // Ini akan mengembalikan NextResponse (bisa berupa rewrite, redirect, atau next)
  const response = handleI18nRouting(request);

  // 2. Teruskan request DAN response dari next-intl ke Supabase helper
  // Supabase akan menyisipkan cookies auth ke dalam response tersebut
  return await updateSession(request, response);
}

export const config = {
  // Matcher: Abaikan api, _next, file statis, dll.
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
