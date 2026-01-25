import { NextResponse } from "next/server";
import { apiSecretKey } from "@/helper/api-secret-key";
import { GoogleGenerativeAI } from "@google/generative-ai";

const geminiApiKey = process.env.GEMINI_API_KEY;

const apiBaseUrl =
  process.env.NODE_ENV === "production"
    ? process.env.NEXT_PUBLIC_PROD_BACKEND_URL
    : process.env.NEXT_PUBLIC_DEV_BACKEND_URL;

// Function to strip markdown/richtext characters
function stripMarkdown(text: string): string {
  return (
    text
      // Remove headers (# ## ### etc)
      .replace(/^#{1,6}\s+/gm, "")
      // Remove bold (**text** or __text__)
      .replace(/\*\*(.+?)\*\*/g, "$1")
      .replace(/__(.+?)__/g, "$1")
      // Remove italic (*text* or _text_)
      .replace(/\*(.+?)\*/g, "$1")
      .replace(/_(.+?)_/g, "$1")
      // Remove strikethrough (~~text~~)
      .replace(/~~(.+?)~~/g, "$1")
      // Remove inline code (`code`)
      .replace(/`(.+?)`/g, "$1")
      // Remove code blocks (```code```)
      .replace(/```[\s\S]*?```/g, "")
      // Remove blockquotes (> text)
      .replace(/^>\s+/gm, "")
      // Remove unordered list markers (- or * or +)
      .replace(/^[\-\*\+]\s+/gm, "")
      // Remove ordered list markers (1. 2. etc)
      .replace(/^\d+\.\s+/gm, "")
      // Remove links [text](url)
      .replace(/\[(.+?)\]\(.+?\)/g, "$1")
      // Remove images ![alt](url)
      .replace(/!\[.*?\]\(.+?\)/g, "")
      // Remove horizontal rules (--- or ***)
      .replace(/^[\*_]{3,}$/gm, "")
      // Remove extra newlines
      .replace(/\n{3,}/g, "\n\n")
      .trim()
  );
}

async function getChatSessionData(sessionId: string) {
  try {
    const res = await fetch(
      `${apiBaseUrl}/api/v1/chat-activities/${sessionId}`,
      {
        cache: "no-store",
        method: "GET",
        headers: {
          "X-API-Key": apiSecretKey,
          "Content-Type": "application/json",
        },
      },
    );

    if (!res.ok) {
      return { error: "Failed to fetch chat session" };
    }

    const json = await res.json();

    if (
      !json.data.chat_activity_data ||
      !json.data.chat_activity_data.messages
    ) {
      return { error: "Chat session not found or has no messages" };
    }

    return {
      success: true,
      messages: json.data.chat_activity_data.messages || [],
    };
  } catch (error) {
    console.error("Get Chat Session Error:", error);
    return { error: "Failed to fetch chat session" };
  }
}

export async function POST(req: Request) {
  try {
    const { sessionId, locale } = await req.json();

    if (!sessionId) {
      return NextResponse.json(
        { error: "Session ID is required" },
        { status: 400 },
      );
    }

    // Get chat session data
    const chatData = await getChatSessionData(sessionId);

    if (chatData.error || !chatData.messages) {
      return NextResponse.json(
        { error: chatData.error || "No messages found" },
        { status: 404 },
      );
    }

    // Format messages for AI
    const chatMessages = chatData.messages
      .map((msg: any) => {
        const sender = msg.sender === "bot" ? "Asisten AI" : "Pasien";
        return `${sender}: ${msg.message}`;
      })
      .join("\n");

    // Create prompt for summarization (bilingual)
    const systemPrompt = `Kamu adalah asisten medis profesional. Tugasmu adalah membuat rangkuman keluhan kesehatan pasien dari percakapan yang diberikan dalam DUA BAHASA (Indonesia dan Inggris).

Buatlah rangkuman yang:
1. Mencakup keluhan utama pasien
2. Gejala-gejala yang disebutkan
3. Durasi atau waktu keluhan muncul (jika disebutkan)
4. Faktor-faktor yang memperburuk atau meringankan (jika ada)
5. Riwayat kesehatan relevan yang disebutkan

Format rangkuman dalam paragraf yang jelas dan ringkas, gunakan bahasa yang mudah dipahami oleh tenaga medis. Jangan menambahkan informasi yang tidak ada dalam percakapan.

Tambahkan tanda strip tiga kali dengan spasi "- - -" sebagai pemisah antara bahasa indonesia dan inggris.

FORMAT OUTPUT WAJIB:
[Indonesia] : [Rangkuman dalam Bahasa Indonesia]
- - -
[English] : [Summary in English]`;

    const userPrompt = `Berikut adalah percakapan antara pasien dan asisten AI kesehatan:\n\n${chatMessages}\n\nBuatlah rangkuman keluhan kesehatan pasien berdasarkan percakapan di atas dalam DUA BAHASA. Tulis rangkuman Bahasa Indonesia terlebih dahulu, lalu pisahkan dengan "---", kemudian tulis rangkuman dalam Bahasa Inggris.`;

    if (!geminiApiKey) {
      return NextResponse.json(
        { error: "GEMINI_API_KEY not configured" },
        { status: 500 },
      );
    }

    // Init Gemini AI
    const genAI = new GoogleGenerativeAI(geminiApiKey);
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
    });

    // Generate summary using Gemini
    const result = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `${systemPrompt}\n\n${userPrompt}\n\nPENTING: Berikan respons dalam teks biasa tanpa format markdown, bold, italic, bullet points, atau karakter khusus lainnya.`,
            },
          ],
        },
      ],
    });

    const rawSummary =
      result.response.text() ||
      (locale === "id"
        ? "Maaf, tidak dapat membuat rangkuman saat ini."
        : "Sorry, unable to create summary at this time.");

    // bawah    // Strip any remaining markdown characters
    const summary = stripMarkdown(rawSummary);

    return NextResponse.json({
      success: true,
      summary,
    });
  } catch (error: any) {
    console.error("Summary API Error:", error.message);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
