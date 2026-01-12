// app/api/log-not-found/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/client";
import { get } from "node:http";
import { getPaymentsByOrderID } from "@/lib/transaction/get-payments-data";

const supabase = createClient();

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const param = await params;
    const order_id = param.id;

    if (!order_id) {
      return NextResponse.json(
        { error: "Missing required parameter: id" },
        { status: 400 }
      );
    }

    const { data } = await getPaymentsByOrderID(order_id);

    return NextResponse.json({ success: true, data: data }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Error fetching transactiondata" },
      { status: 500 }
    );
  }
}
