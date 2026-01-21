import { NextResponse } from "next/server";

const OWNER = "m-health-dev";
const REPO = "staging-m-health-v1";
const PER_PAGE = 100;
const BRANCH = "main"; // pastikan benar

export async function GET(req: Request) {
  const apiKey = process.env.API_SECRET_KEY;
  const authHeader = req.headers.get("authorization");

  if (authHeader !== `Bearer ${apiKey}`) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 },
    );
  }

  let page = 1;
  let allCommits: any[] = [];

  while (true) {
    const res = await fetch(
      `https://api.github.com/repos/${OWNER}/${REPO}/commits?per_page=${PER_PAGE}&page=${page}&sha=${BRANCH}`,
      {
        headers: {
          Accept: "application/vnd.github+json",
          Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
        },
      },
    );

    if (!res.ok) break;

    const commits = await res.json();

    if (!commits.length) break;

    allCommits.push(...commits);
    page++;
  }

  return NextResponse.json(allCommits);
}
