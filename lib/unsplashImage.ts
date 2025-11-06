export async function getImage() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/unsplash?query=sea%20indonesia&page=1&per_page=10`,
    {
      next: { revalidate: 60 },
      headers: {
        Authorization: `Bearer ${process.env.API_SECRET_KEY}`,
      },
    }
  );
  if (!res.ok) throw new Error("Failed to fetch Unsplash Image");
  return res.json();
}

export async function get5ImageWellness() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/unsplash?query=wellness%20indonesia&page=1&per_page=5`,
    {
      next: { revalidate: 60 },
      headers: {
        Authorization: `Bearer ${process.env.API_SECRET_KEY}`,
      },
    }
  );
  if (!res.ok) throw new Error("Failed to fetch Wellness Unsplash Image");
  return res.json();
}

export async function get5ImageMedical() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/unsplash?query=Medical%20indonesia&page=1&per_page=5`,
    {
      next: { revalidate: 60 },
      headers: {
        Authorization: `Bearer ${process.env.API_SECRET_KEY}`,
      },
    }
  );
  if (!res.ok) throw new Error("Failed to fetch Medical Unsplash Image");
  return res.json();
}

export async function get5ImageEvents() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/unsplash?query=Events%20indonesia&page=1&per_page=5`,
    {
      next: { revalidate: 60 },
      headers: {
        Authorization: `Bearer ${process.env.API_SECRET_KEY}`,
      },
    }
  );
  if (!res.ok) throw new Error("Failed to fetch Events Unsplash Image");
  return res.json();
}
