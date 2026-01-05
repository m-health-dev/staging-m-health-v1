import { NextResponse } from "next/server";

import {
  getUsersRecovery,
  resetRecoveryUser,
} from "@/lib/users/recovery/get-set-recovery-users";

export async function GET(
  _req: Request,
  context: { params: Promise<{ id: string }> }
) {
  // NOTE: folder name is [id], so Next.js provides params.id.
  // For GET, we treat that path segment as an email.
  const { id } = await context.params;
  const email = decodeURIComponent(id);
  const result = await getUsersRecovery({ email });

  return NextResponse.json(result, { status: result.success ? 200 : 400 });
}

export async function POST(
  _req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const result = await resetRecoveryUser({ id });

  return NextResponse.json(result, { status: result.success ? 200 : 400 });
}
