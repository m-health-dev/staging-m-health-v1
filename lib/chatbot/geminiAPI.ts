"use server";

import { apiSecretKey } from "@/helper/api-secret-key";

const apiBaseUrl =
  process.env.NODE_ENV === "production"
    ? process.env.NEXT_PUBLIC_PROD_BACKEND_URL
    : process.env.NEXT_PUBLIC_DEV_BACKEND_URL;

export async function chatGemini(payload: {
  messages: any[];
  prompt: string;
  replyTo?: {
    message?: string | null;
    sender?: string | null;
  };
  user_id?: string;
  public_id: string;
  session_id?: string;
}) {
  try {
    // console.log("Sending messages to Gemini API:", payload);
    const res = await fetch(`${apiBaseUrl}/api/v1/gemini/generate`, {
      method: "POST",
      headers: {
        "X-API-Key": apiSecretKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    console.log(data.session_id);

    return {
      message: data.raw.candidates[0].content.parts[0].text,
      session_id: data.session_id,
      urgent: data.urgent,
    };
  } catch (error) {
    console.error("Gemini API Error:", error);
    return { message: "Terjadi kesalahan saat terhubung ke server." };
  }
}
