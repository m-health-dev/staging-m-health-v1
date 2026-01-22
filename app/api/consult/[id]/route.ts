import { NextResponse } from "next/server";
import { getConsultationByID } from "@/lib/consult/get-consultation";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: "Consultation ID is required" },
        { status: 400 }
      );
    }

    const { data } = await getConsultationByID(id);

    if (!data) {
      return NextResponse.json(
        { error: "Consultation not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: data.data,
    });
  } catch (error: any) {
    console.error("Consultation API Error:", error.message);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
