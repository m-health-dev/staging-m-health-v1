import { Message } from "@/components/chatbot/ChatStart";

export async function chatGemini(payload: { messages: any[]; prompt: string }) {
  try {
    console.log("Sending messages to Gemini API:", payload);
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_PROD_BACKEND_URL}/api/v1/gemini/generate`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    );

    const data = await res.json();

    return {
      message: data.raw.candidates[0].content.parts[0].text,
    };
  } catch (error) {
    console.error("Gemini API Error:", error);
    return { message: "Terjadi kesalahan saat terhubung ke server." };
  }
}
