// /app/api/changelog/route.ts
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const apiKey = process.env.API_SECRET_KEY;
  const authHeader = req.headers.get("authorization");

  if (authHeader !== `Bearer ${apiKey}`) {
    return NextResponse.json(
      { success: false, code: "401", error: "Unauthorized" },
      { status: 401 }
    );
  }
  const res = await fetch(
    "https://api.github.com/repos/m-health-dev/staging-m-health-v1/commits",
    {
      headers: {
        Accept: "application/vnd.github+json",
        Authorization: `Bearer ${process.env.GITHUB_TOKEN}`, // optional, untuk rate limit besar
      },
      next: { revalidate: 60 }, // revalidate setiap 1 jam
    }
  );

  const commits = await res.json();
  return NextResponse.json(commits);
}
