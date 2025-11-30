const apiBaseUrl = process.env.NEXT_PUBLIC_PROD_BACKEND_URL;

export async function getAllMedical() {
  const res = await fetch(`${apiBaseUrl}/api/v1/medical`, {
    next: { revalidate: 60 },
  });
  if (!res.ok) throw new Error("Failed to fetch All Medical Data");
  return res.json();
}
