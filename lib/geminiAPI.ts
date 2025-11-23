import { Message } from "@/components/chatbot/ChatStart";

export async function chatGemini(messages: any[]) {
  try {
    console.log("Sending messages to Gemini API:", messages);
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/gemini`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ messages }),
    });

    const data = await res.json();

    return {
      message: data.message,
    };
  } catch (error) {
    console.error("Gemini API Error:", error);
    return { message: "Terjadi kesalahan saat terhubung ke server." };
  }
}
