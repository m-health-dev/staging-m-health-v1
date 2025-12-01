const apiBaseUrl =
  process.env.NODE_ENV === "production"
    ? process.env.NEXT_PUBLIC_PROD_BACKEND_URL
    : process.env.NEXT_PUBLIC_DEV_BACKEND_URL;

export async function getUserInfo(token: string) {
  const res = await fetch(`${apiBaseUrl}/api/v1/me`, {
    next: { revalidate: 60 },
    headers: {
      authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error("Failed to fetch All Medical Data");
  return res.json();
}
