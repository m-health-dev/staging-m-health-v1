import { cookies } from "next/headers";

const internalUrl = `${
  process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3030"
}/api/auth/me`;

export async function getAuthServer() {
  try {
    const cookieStore = await cookies();

    console.log("[v0] Auth server - fetching from:", internalUrl);

    const res = await fetch(internalUrl, {
      headers: {
        Cookie: cookieStore.toString(),
        Accept: "application/json",
      },
      cache: "no-store",
    });

    if (res.status === 401) {
      console.log("[v0] Auth server - user not authenticated");
      return null;
    }

    if (!res.ok) {
      const text = await res.text();
      console.error("[v0] Auth server error:", res.status);
      console.error("[v0] Response:", text?.slice(0, 200));
      return null; // Return null instead of throwing for better UX
    }

    const data = await res.json();
    console.log(
      "[v0] Auth server - user loaded:",
      data?.user?.email || data?.email
    );

    return data.user || data; // Handle both wrapped and direct responses
  } catch (error) {
    console.error("[v0] Auth server exception:", error);
    return null;
  }
}
