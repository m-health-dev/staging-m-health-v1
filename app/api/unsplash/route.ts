import { NextResponse } from "next/server";

const UNSPLASH_URL = "https://api.unsplash.com/search/photos";

export async function GET(req: Request) {
  const apiKey = process.env.API_SECRET_KEY;
  const authHeader = req.headers.get("authorization");
  const clientToken = req.headers.get("x-client-token");

  // console.log("AuthHeader:", clientToken);
  // console.log("Expected:", `Bearer ${apiKey}`);

  if (clientToken !== process.env.NEXT_PUBLIC_INTERNAL_TOKEN) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // if (authHeader !== `Bearer ${apiKey}`) {
  //   return NextResponse.json(
  //     { success: false, code: "401", error: "Unauthorized" },
  //     { status: 401 }
  //   );
  // }

  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("query") || "nature";
    const page = searchParams.get("page") || "1";
    const per_page = searchParams.get("per_page") || "10";

    const res = await fetch(
      `${UNSPLASH_URL}?query=${query}&page=${page}&per_page=${per_page}`,
      {
        headers: {
          Authorization: `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}`,
        },
        // non-cache agar selalu fresh
        cache: "no-store",
      }
    );

    if (!res.ok) {
      return NextResponse.json(
        { error: `Unsplash API error: ${res.status}` },
        { status: res.status }
      );
    }

    const data = await res.json();

    // Format hasil agar lebih bersih
    const formatted = data.results.map((img: any) => ({
      id: img.id,
      description: img.description || img.alt_description,
      alt: img.alt_description,
      url: img.urls.small,
      full: img.urls.full,
      width: img.width,
      height: img.height,
      author: {
        name: img.user.name,
        profile: img.user.links.html,
      },
    }));

    return NextResponse.json({
      success: true,
      total: data.total,
      total_pages: data.total_pages,
      results: formatted,
    });
  } catch (error: any) {
    console.error("Unsplash API Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
