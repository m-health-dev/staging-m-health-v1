export async function getImage() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/unsplash?query=sea%20indonesia&page=1&per_page=10`,
    {
      next: { revalidate: 60 },
      headers: {
        Authorization: `Bearer ${process.env.API_SECRET_KEY}`,
        "x-client-token": `${process.env.NEXT_PUBLIC_INTERNAL_TOKEN}`,
      },
    }
  );
  if (!res.ok) throw new Error("Failed to fetch Unsplash Image");
  return res.json();
}

export async function getImageAbout() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/unsplash?query=our%20teams&page=1&per_page=1`,
    {
      next: { revalidate: 60 },
      headers: {
        Authorization: `Bearer ${process.env.API_SECRET_KEY}`,
        "x-client-token": `${process.env.NEXT_PUBLIC_INTERNAL_TOKEN}`,
      },
    }
  );
  if (!res.ok) throw new Error("Failed to fetch Unsplash Image");
  return res.json();
}

export async function getImagePackageDetail(query: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/unsplash?query=${query}&page=1&per_page=10`,
    {
      next: { revalidate: 60 },
      headers: {
        Authorization: `Bearer ${process.env.API_SECRET_KEY}`,
        "x-client-token": `${process.env.NEXT_PUBLIC_INTERNAL_TOKEN}`,
      },
    }
  );
  if (!res.ok) throw new Error("Failed to fetch Unsplash Image");
  return res.json();
}

export async function get3Image() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/unsplash?query=health&page=3&per_page=3`,
    {
      next: { revalidate: 60 },
      headers: {
        Authorization: `Bearer ${process.env.API_SECRET_KEY}`,
        "x-client-token": `${process.env.NEXT_PUBLIC_INTERNAL_TOKEN}`,
      },
    }
  );
  if (!res.ok) throw new Error("Failed to fetch Unsplash Image");
  return res.json();
}

export async function get5Image() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/unsplash?page=1&per_page=5`,
    {
      next: { revalidate: 60 },
      headers: {
        Authorization: `Bearer ${process.env.API_SECRET_KEY}`,
        "x-client-token": `${process.env.NEXT_PUBLIC_INTERNAL_TOKEN}`,
      },
    }
  );
  if (!res.ok) throw new Error("Failed to fetch Unsplash Image");
  return res.json();
}

export async function get10ImageHospital() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/unsplash?query=hospital%20indonesia&page=1&per_page=10`,
    {
      next: { revalidate: 60 },
      headers: {
        Authorization: `Bearer ${process.env.API_SECRET_KEY}`,
        "x-client-token": `${process.env.NEXT_PUBLIC_INTERNAL_TOKEN}`,
      },
    }
  );
  if (!res.ok) throw new Error("Failed to fetch Hospital Unsplash Image");
  return res.json();
}

export async function get5ImageWellness() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/unsplash?query=wellness&page=1&per_page=5`,
    {
      next: { revalidate: 60 },
      headers: {
        Authorization: `Bearer ${process.env.API_SECRET_KEY}`,
        "x-client-token": `${process.env.NEXT_PUBLIC_INTERNAL_TOKEN}`,
      },
    }
  );
  if (!res.ok) throw new Error("Failed to fetch Wellness Unsplash Image");
  return res.json();
}

export async function get5ImageMedical() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/unsplash?query=Medical&page=1&per_page=5`,
    {
      next: { revalidate: 60 },
      headers: {
        Authorization: `Bearer ${process.env.API_SECRET_KEY}`,
        "x-client-token": `${process.env.NEXT_PUBLIC_INTERNAL_TOKEN}`,
      },
    }
  );
  if (!res.ok) throw new Error("Failed to fetch Medical Unsplash Image");
  return res.json();
}

export async function get10ImageEvents() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/unsplash?query=Events&page=1&per_page=10`,
    {
      next: { revalidate: 60 },
      headers: {
        Authorization: `Bearer ${process.env.API_SECRET_KEY}`,
        "x-client-token": `${process.env.NEXT_PUBLIC_INTERNAL_TOKEN}`,
      },
    }
  );
  if (!res.ok) throw new Error("Failed to fetch Events Unsplash Image");
  return res.json();
}

export async function get5ImageNews() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/unsplash?query=News&page=1&per_page=5`,
    {
      next: { revalidate: 60 },
      headers: {
        Authorization: `Bearer ${process.env.API_SECRET_KEY}`,
        "x-client-token": `${process.env.NEXT_PUBLIC_INTERNAL_TOKEN}`,
      },
    }
  );
  if (!res.ok) throw new Error("Failed to fetch News Unsplash Image");
  return res.json();
}
