export async function getCommits() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/changelog`, {
    next: { revalidate: 60 },
    headers: {
      Authorization: `Bearer ${process.env.API_SECRET_KEY}`,
    },
  });
  if (!res.ok) throw new Error("Failed to fetch Git Commits Data");
  return res.json();
}
