const apiBaseUrl = process.env.NEXT_PUBLIC_PROD_BACKEND_URL;

export async function getAllPackages() {
  const res = await fetch(`${apiBaseUrl}/api/v1/packages`, {
    next: { revalidate: 60 },
  });
  if (!res.ok) throw new Error("Failed to fetch All Packages Data");
  return res.json();
}
