export async function getImagePicsum() {
  const res = await fetch(`https://picsum.photos/v2/list`, {
    next: { revalidate: 60 },
    headers: {
      "x-client-token": `${process.env.NEXT_PUBLIC_INTERNAL_TOKEN}`,
    },
  });
  if (!res.ok) throw new Error("Failed to fetch Picsum Image");
  return res.json();
}
