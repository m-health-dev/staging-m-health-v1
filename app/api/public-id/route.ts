import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

export async function GET() {
  const cookieStore = await cookies();
  let publicID = cookieStore.get("mhealth_public_id")?.value;

  if (!publicID) {
    publicID = uuidv4();
    cookieStore.set("mhealth_public_id", publicID, {
      path: "/",
      httpOnly: false,
      sameSite: "lax",
      expires: new Date("2099-12-31"),
    });
  }

  return NextResponse.json({ publicID });
}
