type ChatMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

const DEFAULT_TEMPERATURE = 0.4;
const FALLBACK_MESSAGE = "Maaf, saya tidak dapat memproses permintaan Anda saat ini.";

// Gemini responses may arrive in different shapes; this helper normalizes them.
const extractCandidateText = (payload: any): string | undefined => {
  if (!payload?.candidates || !Array.isArray(payload.candidates)) return undefined;

  const combined = payload.candidates
    .map((candidate: any) => {
      if (candidate?.content?.parts?.length) {
        return candidate.content.parts
          .map((part: any) => part?.text)
          .filter(Boolean)
          .join("\n\n");
      }

      if (Array.isArray(candidate?.content)) {
        return candidate.content
          .map((part: any) => part?.text)
          .filter(Boolean)
          .join("\n\n");
      }

      return candidate?.content ?? candidate?.text;
    })
    .filter(Boolean)
    .join("\n\n")
    .trim();

  return combined || undefined;
};

// Walk a list of potential message fields and return the first non-empty string.
const pickFirstValidMessage = (messages: Array<string | undefined>): string | undefined => {
  for (const entry of messages) {
    if (typeof entry === "string" && entry.trim()) {
      return entry.trim();
    }
  }
  return undefined;
};

export async function chatGemini(messages: ChatMessage[]) {
  try {
    // Flatten conversation into a single prompt accepted by the backend Gemini proxy
    const prompt = messages
      ?.map((msg) => {
        const label =
          msg.role === "system"
            ? "System"
            : msg.role === "assistant"
            ? "Mei"
            : "User";
        return `${label}: ${msg.content}`;
      })
      .join("\n\n")
      .trim();

    if (!prompt) {
      throw new Error("Prompt kosong. Tidak ada pesan yang bisa dikirim ke Gemini.");
    }

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_PROD_BACKEND_URL}/api/v1/gemini/generate`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt,
          options: {
            generationConfig: {
              temperature: DEFAULT_TEMPERATURE,
            },
          },
        }),
      }
    );

    if (!res.ok) {
      const errorPayload = await res.text();
      throw new Error(
        `Gemini API ${res.status} ${res.statusText}: ${errorPayload || "No response body"}`
      );
    }

    const data = await res.json();
    console.log("Gemini API Response:", data);

    const message =
      pickFirstValidMessage([
        extractCandidateText(data),
        extractCandidateText(data?.data),
        data?.message,
        data?.data?.message,
        data?.data?.content,
        data?.data?.choices?.[0]?.message?.content,
      ]) ?? FALLBACK_MESSAGE;

    return { message };
  } catch (error) {
    console.error("Gemini API Error:", error);
    return { message: "Terjadi kesalahan saat terhubung ke server." };
  }
}
