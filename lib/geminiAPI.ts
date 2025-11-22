export async function chatGemini(messages: any[]) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_PROD_BACKEND_URL}/api/v1/gemini/generate`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: messages,
        }),
      }
    );

    const data = await res.json();

    return {
      message: data.message,
    };
  } catch (error) {
    console.error("Gemini API Error:", error);
    return { message: "Terjadi kesalahan saat terhubung ke server." };
  }
}
