import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

export async function updateSession(
  request: NextRequest,
  response: NextResponse, // Response dari next-intl diterima di sini
) {
  // Ambil locale dari URL path, misal /en/dashboard -> en
  // Asumsi format: /{locale}/...
  const locale = request.nextUrl.pathname.split("/")[1] || "en";

  // let supabaseResponse = NextResponse.next({
  //   request,
  // });

  // const supabase = createServerClient(
  //   process.env.NEXT_PUBLIC_SUPABASE_URL!,
  //   process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
  //   {
  //     cookies: {
  //       getAll() {
  //         return request.cookies.getAll();
  //       },
  //       setAll(cookiesToSet) {
  //         // 1. Update cookies di Request (agar tersedia di server components)
  //         cookiesToSet.forEach(({ name, value }) =>
  //           request.cookies.set(name, value)
  //         );

  //         // 2. Update cookies di Response (agar tersimpan di browser user)
  //         // PENTING: Kita update response yang dipassing dari next-intl
  //         cookiesToSet.forEach(({ name, value, options }) =>
  //           response.cookies.set(name, value, options)
  //         );
  //       },
  //     },
  //   }
  // );

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          // response = NextResponse.next({
          //   request,
          // });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // Mengambil user untuk cek auth
  const checkUserRole = (await supabase.auth.getClaims()).data?.claims;
  const readUserRole = checkUserRole?.user_role as string | undefined;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // --- LOGIC PROTEKSI ROUTE ---

  // 1. Jika User BELUM login dan mencoba akses Dashboard
  if (!user && request.nextUrl.pathname.startsWith(`/${locale}/dashboard`)) {
    const url = request.nextUrl.clone();
    url.pathname = `/${locale}/sign-in`;

    // Opsional: Simpan halaman yang ingin diakses untuk redirect balik nanti
    url.searchParams.set("redirect", request.nextUrl.pathname);

    return NextResponse.redirect(url);
  }

  if (!user && request.nextUrl.pathname.startsWith(`/${locale}/connect`)) {
    const url = request.nextUrl.clone();
    url.pathname = `/${locale}/sign-in`;

    // Opsional: Simpan halaman yang ingin diakses untuk redirect balik nanti
    url.searchParams.set("redirect", request.nextUrl.pathname);

    return NextResponse.redirect(url);
  }

  if (!user && request.nextUrl.pathname.startsWith(`/${locale}/pay`)) {
    const url = request.nextUrl.clone();
    url.pathname = `/${locale}/sign-in`;

    // Opsional: Simpan halaman yang ingin diakses untuk redirect balik nanti
    url.searchParams.set("redirect", request.nextUrl.pathname);

    return NextResponse.redirect(url);
  }

  if (!user && request.nextUrl.pathname.startsWith(`/${locale}/studio`)) {
    const url = request.nextUrl.clone();
    url.pathname = `/${locale}/sign-in`;

    // Opsional: Simpan halaman yang ingin diakses untuk redirect balik nanti
    url.searchParams.set("redirect", request.nextUrl.pathname);

    return NextResponse.redirect(url);
  }

  if (!user && request.nextUrl.pathname.startsWith(`/${locale}/account`)) {
    const url = request.nextUrl.clone();
    url.pathname = `/${locale}/sign-in`;

    // Opsional: Simpan halaman yang ingin diakses untuk redirect balik nanti
    url.searchParams.set("redirect", request.nextUrl.pathname);

    return NextResponse.redirect(url);
  }

  if (!user && request.nextUrl.pathname.startsWith(`/${locale}/connect`)) {
    // 1. Ambil path lengkap beserta query parameternya (?session=...)
    const fullPath = request.nextUrl.pathname + request.nextUrl.search;

    // 2. Buat URL baru untuk halaman sign-in
    const signInUrl = new URL(`/${locale}/sign-in`, request.url);

    // 3. Set 'redirect' dengan path lengkap tadi
    signInUrl.searchParams.set("redirect", fullPath);

    // 4. Lakukan redirect
    return NextResponse.redirect(signInUrl);
  }

  if (
    user &&
    request.nextUrl.pathname.startsWith(`/${locale}/studio`) &&
    readUserRole !== "admin"
  ) {
    const url = request.nextUrl.clone();
    url.pathname = `/${locale}/forbidden`;

    // Opsional: Simpan halaman yang ingin diakses untuk redirect balik nanti
    url.searchParams.set("request", request.nextUrl.pathname);

    return NextResponse.redirect(url);
  }

  // if (
  //   !user &&
  //   request.nextUrl.pathname.startsWith(`/${locale}/reset-password`)
  // ) {
  //   const url = request.nextUrl.clone();
  //   url.pathname = `/${locale}/sign-in`;

  //   // Opsional: Simpan halaman yang ingin diakses untuk redirect balik nanti
  //   url.searchParams.set("redirect", request.nextUrl.pathname);

  //   return NextResponse.redirect(url);
  // }

  // 2. Jika User SUDAH login dan mencoba akses halaman Sign-In/Sign-Up
  if (user) {
    if (
      request.nextUrl.pathname.startsWith(`/${locale}/sign-in`) ||
      request.nextUrl.pathname.startsWith(`/${locale}/sign-up`)
    ) {
      const url = request.nextUrl.clone();
      url.pathname = `/${locale}/dashboard`;
      return NextResponse.redirect(url);
    }
  }

  // PENTING: Kembalikan response object yang sudah dimodifikasi (cookie set)
  return response;
}
