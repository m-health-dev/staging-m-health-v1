import createMiddleware from "next-intl/middleware";
import { NextResponse } from "next/server";
import { routing } from "./i18n/routing";

export default function middleware(req: Request) {
  const url = new URL(req.url);

  // Jika environment = production → redirect semua ke /coming-soon
  if (process.env.NODE_ENV === "development") {
    // Kecualikan path yang sudah di /coming-soon supaya tidak loop redirect
    if (!url.pathname.startsWith("/coming-soon")) {
      url.pathname = "/coming-soon";
      return NextResponse.redirect(url);
    }
  }
}

export const config = {
  matcher: "/((?!api|coming-soon|trpc|_next|_vercel|.*\\..*).*)",
};
