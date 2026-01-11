import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";

import createTransaction from "@/lib/transaction/create";

const payloadSchema = z.object({
  amount: z.preprocess(
    (value) => (typeof value === "string" ? Number(value) : value),
    z.number().int().positive()
  ),
  itemName: z.string().min(1, "Item name is required"),
  orderId: z.string().optional(),
  customer: z
    .object({
      first_name: z.string().optional(),
      last_name: z.string().optional(),
      email: z.string().email().optional(),
      phone: z.string().optional(),
    })
    .optional(),
});

export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsed = payloadSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Invalid payload",
        details: parsed.error.flatten(),
      },
      { status: 400 }
    );
  }

  const { amount, itemName, orderId, customer } = parsed.data;
  const resolvedOrderId = orderId ?? `order-${uuidv4()}`;
  const callbackBaseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || req.nextUrl.origin;

  try {
    const transaction = await createTransaction({
      orderId: resolvedOrderId,
      grossAmount: amount,
      itemDetails: [
        {
          id: resolvedOrderId,
          price: amount,
          quantity: 1,
          name: itemName,
        },
      ],
      customerDetails: customer,
      callbacks: {
        finish: `${callbackBaseUrl}/pay/${resolvedOrderId}?status=success`,
        pending: `${callbackBaseUrl}/pay/${resolvedOrderId}?status=pending`,
        error: `${callbackBaseUrl}/pay/${resolvedOrderId}?status=failed`,
      },
    });

    return NextResponse.json(transaction);
  } catch (error) {
    console.error("Midtrans transaction error:", error);
    return NextResponse.json(
      { error: "Failed to create payment session" },
      { status: 500 }
    );
  }
}
