// MASIH PAKAI DATA PACKAGES

const apiBaseUrl =
  process.env.NODE_ENV === "production"
    ? process.env.NEXT_PUBLIC_PROD_BACKEND_URL
    : process.env.NEXT_PUBLIC_DEV_BACKEND_URL;

export async function getAllWellness() {
  const res = await fetch(`${apiBaseUrl}/api/v1/packages`, {
    next: { revalidate: 60 },
  });
  if (!res.ok) throw new Error("Failed to fetch All packages Data");
  return res.json();
}

export async function getLatest3Wellness() {
  const res = await fetch(`${apiBaseUrl}/api/v1/packages?per_page=3`, {
    next: { revalidate: 60 },
  });
  if (!res.ok) throw new Error("Failed to fetch Latest 3 wellness Data");
  return res.json();
}
