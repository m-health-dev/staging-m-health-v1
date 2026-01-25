import { getAllPaymentsRecord } from "@/lib/transaction/get-payments-data";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = Number(searchParams.get("page")) || 1;
    const per_page = Number(searchParams.get("per_page")) || 10;

    const { data, meta, links, total } = await getAllPaymentsRecord(
      page,
      per_page,
    );

    return NextResponse.json({ data, meta, links, total });
  } catch (error) {
    console.error("Error in GET /api/live/transaction:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
