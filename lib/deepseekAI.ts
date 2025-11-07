// /lib/deepseekAI.ts
export async function chatDeepseek(
  messages: { role: string; content: string }[]
) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/deepseek`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ messages }),
  });

  if (!res.ok) throw new Error("Failed to fetch DeepSeek AI");
  return res.json();
}
