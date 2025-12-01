import { Message } from "@/components/chatbot/ChatStart";

const apiBaseUrl =
  process.env.NODE_ENV === "production"
    ? process.env.NEXT_PUBLIC_PROD_BACKEND_URL
    : process.env.NEXT_PUBLIC_DEV_BACKEND_URL;

export async function getChatHistory(public_id: string) {
  try {
    console.log("Get Chat History for Public ID:", public_id);
    const res = await fetch(
      `${apiBaseUrl}/api/v1/chat-activities/all/${public_id}`,
      {
        cache: "no-store",
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const json = await res.json();
    console.log(`Success Get ${json.total} Chat History for `, public_id);

    const data = json.data;

    return { data };
  } catch (error) {
    console.error("Get Chat Activities Error:", error);
    return { message: "Terjadi kesalahan saat terhubung ke server." };
  }
}

export async function getChatSession(session_id: string) {
  try {
    console.log("Get Chat Session:", session_id);
    const res = await fetch(
      `${apiBaseUrl}/api/v1/chat-activities/${session_id}`,
      {
        cache: "no-store",
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    console.log(res.url);

    const json = await res.json();

    if (!json.chat_activity_data || !json.chat_activity_data.messages) {
      return { warning: "Chat sudah dihapus atau diarsipkan." };
    }

    console.log(`Success Get Chat Session for `, session_id);

    const data = json.chat_activity_data.messages;

    console.log(data);

    return { data };
  } catch (error) {
    console.error("Get Chat Session Error:", error);
    return { message: "Terjadi kesalahan saat terhubung ke server." };
  }
}
