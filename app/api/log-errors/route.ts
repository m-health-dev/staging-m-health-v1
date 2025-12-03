// app/api/log-not-found/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/client";

const supabase = createClient();

export async function POST(request: NextRequest) {
  try {
    const {
      pathname,
      error_code,
      error_message,
      rayId,
      ipAddress,
      browserInfo,
    } = await request.json();

    // Insert data into Supabase
    const { error } = await supabase.from("errors").insert([
      {
        ray_id: rayId,
        ip_address: ipAddress,
        browser: browserInfo.browser,
        os: browserInfo.os,
        device: browserInfo.device,
        pathname: pathname,
        error_code: error_code,
        error_message: error_message,
        accessed_at: new Date().toISOString(),
      },
    ]);

    if (error) {
      console.error(error.code + " " + error.message);
      return NextResponse.json(
        { error: "Error inserting data" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Error logging not found" },
      { status: 500 }
    );
  }
}
