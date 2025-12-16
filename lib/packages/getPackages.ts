const apiBaseUrl =
  process.env.NODE_ENV === "production"
    ? process.env.NEXT_PUBLIC_PROD_BACKEND_URL
    : process.env.NEXT_PUBLIC_DEV_BACKEND_URL;

export async function getAllPackages() {
  const res = await fetch(`${apiBaseUrl}/api/v1/packages`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to fetch All Packages Data");
  return res.json();
}

export async function getLatest3Packages() {
  const res = await fetch(`${apiBaseUrl}/api/v1/packages?per_page=3`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to fetch Latest 3 Packages Data");
  return res.json();
}
