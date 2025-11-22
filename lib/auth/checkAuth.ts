const apiBaseUrl = process.env.NEXT_PUBLIC_PROD_BACKEND_URL;

export async function getAuth() {
  const res = await fetch(`${apiBaseUrl}/api/v1/me`, {
    next: { revalidate: 60 },
  });
  if (!res.ok) throw new Error("Failed to fetch User Data");
  return res.json();
}
