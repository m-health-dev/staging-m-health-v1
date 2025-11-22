// lib/auth/auth-server.ts  (atau file yang kamu pakai)
const internalUrl = `${process.env.NEXT_PUBLIC_BASE_URL || ""}/api/auth/me`; // NEXT_PUBLIC_SELF_URL mis. http://localhost:3000

export async function getAuthServer() {
  const res = await fetch(internalUrl, {
    // saat SSR, fetch ke internal route otomatis membawa cookie header dari request Next.js
    cache: "no-store",
  });

  if (!res.ok) {
    const text = await res.text();
    console.error("AUTH ERROR STATUS:", res.status);
    console.error("AUTH RESPONSE:", text);
    throw new Error("Failed to fetch user");
  }

  return res.json();
}
