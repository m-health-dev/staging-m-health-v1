/**
 * Client-side data fetching functions for packages
 * Used for lazy loading in components
 */

export async function getPublicPackagesClient(page = 1, limit = 3) {
  try {
    const response = await fetch(
      `/api/packages/public?page=${page}&limit=${limit}`,
      {
        next: { revalidate: 300 }, // Cache for 5 minutes
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch packages");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching packages:", error);
    return { data: [], error: "Failed to fetch packages" };
  }
}
