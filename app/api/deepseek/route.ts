import { NextResponse } from "next/server";

const deepseekApiKey = process.env.DEEPSEEK_API_KEY;
const deepseekBaseUrl = `${process.env.DEEPSEEK_TARGET_URL}`;

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    if (!message) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    if (!deepseekApiKey) {
      return NextResponse.json(
        { error: "DEEPSEEK_API_KEY not configured" },
        { status: 500 }
      );
    }

    const response = await fetch(deepseekBaseUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${deepseekApiKey}`,
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [
          {
            role: "user",
            content: message,
          },
        ],
        temperature: 0.7,
        max_tokens: 1024,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error("[v0] DeepSeek API Error:", error);
      return NextResponse.json(
        { error: "Failed to get response from DeepSeek" },
        { status: response.status }
      );
    }

    const data = await response.json();

    const botMessage =
      data.choices?.[0]?.message?.content ||
      "Maaf, saya tidak dapat memproses pertanyaan Anda saat ini.";

    return NextResponse.json({
      success: true,
      message: botMessage,
    });
  } catch (error: any) {
    console.error("[v0] Chat API Error:", error.message);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
