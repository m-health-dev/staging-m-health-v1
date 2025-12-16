const apiBaseUrl =
  process.env.NODE_ENV === "production"
    ? process.env.NEXT_PUBLIC_PROD_BACKEND_URL
    : process.env.NEXT_PUBLIC_DEV_BACKEND_URL;

export async function getAllMedical() {
  const res = await fetch(`${apiBaseUrl}/api/v1/medical`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to fetch All Medical Data");
  return res.json();
}

export async function getLatest3Medical() {
  const res = await fetch(`${apiBaseUrl}/api/v1/medical?per_page=3`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to fetch Latest 3 Medical Data");
  return res.json();
}
