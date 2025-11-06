export async function chatDeepseek(userMessage: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/deepseek`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ message: userMessage }),
  });
  if (!res.ok) throw new Error("Failed to fetch Deepseek AI");
  return res.json();
}
