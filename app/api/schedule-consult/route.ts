import { createClient } from "@/utils/supabase/client";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const supabase = createClient();

    const { data, error } = await supabase
      .from("consult_schedule")
      .insert(body)
      .select("*")
      .single();

    if (error) {
      console.error(error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ data });
  } catch (e: any) {
    console.error(e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
