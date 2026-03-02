import { NextRequest, NextResponse } from "next/server";
import { encryptPrice } from "@/helper/price-cipher";
import { validateInternalRequest } from "@/helper/api-guard";

export async function POST(request: NextRequest) {
  const blocked = validateInternalRequest(request);
  if (blocked) return blocked;

  try {
    const body = await request.json();
    const { price } = body;

    if (typeof price !== "number" || isNaN(price) || price < 0) {
      return NextResponse.json(
        { error: "Invalid price value" },
        { status: 400 },
      );
    }

    const encrypted = encryptPrice(price);

    return NextResponse.json({ encrypted });
  } catch {
    return NextResponse.json(
      { error: "Failed to encrypt price" },
      { status: 500 },
    );
  }
}
