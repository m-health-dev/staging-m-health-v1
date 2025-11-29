import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  const cookieStore = await cookies();
  const prefix = "sb-";
  const allCookies = cookieStore.getAll();

  // Create the redirect response first
  const response = NextResponse.redirect(
    new URL(
      "/",
      process.env.NODE_ENV === "production"
        ? process.env.NEXT_PUBLIC_BASE_URL
        : "http://localhost:3000"
    )
  );

  // Clear all Supabase cookies
  for (const cookie of allCookies) {
    if (cookie.name.startsWith(prefix)) {
      response.cookies.set({
        name: cookie.name,
        value: "",
        path: "/",
        expires: new Date(0),
        httpOnly: true, // Add this for security
        secure: process.env.NODE_ENV === "production", // Only secure in production
        sameSite: "lax", // Add sameSite attribute
      });
    }
  }

  // Return the response with cleared cookies - don't create a new redirect
  return response;
}
