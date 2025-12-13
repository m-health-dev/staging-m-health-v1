const apiBaseUrl =
  process.env.NODE_ENV === "production"
    ? process.env.NEXT_PUBLIC_PROD_BACKEND_URL
    : process.env.NEXT_PUBLIC_DEV_BACKEND_URL;

export async function getChatHistory(public_id: string) {
  if (!public_id) {
    return { data: [], total: 0 };
  }

  try {
    const res = await fetch(
      `${apiBaseUrl}/api/v1/chat-activities/all/${public_id}`,
      {
        cache: "no-store", // Use standard fetch cache option
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const json = await res.json();

    return {
      data: json.data || [],
      total: json.total || 0,
    };
  } catch (error) {
    console.error("Get Chat Activities Error:", error);
    return {
      data: [],
      total: 0,
      error: "Failed to fetch chat history",
    };
  }
}

export async function getChatHistoryByUserID(user_id: string) {
  if (!user_id) {
    return { data: [], total: 0 };
  }

  try {
    const res = await fetch(
      `${apiBaseUrl}/api/v1/chat-activities/all/${user_id}`,
      {
        cache: "no-store", // Use standard fetch cache option
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!res.ok) {
      throw new Error(`HTTP error! by User ID status: ${res.status}`);
    }

    const json = await res.json();

    return {
      data: json.data || [],
      total: json.total || 0,
    };
  } catch (error) {
    console.error("Get Chat Activities by User ID Error:", error);
    return {
      data: [],
      total: 0,
      error: "Failed to fetch chat history by User ID",
    };
  }
}

export async function getChatSession(session_id: string) {
  if (!session_id) {
    return { error: "Session ID is required" };
  }

  try {
    const res = await fetch(
      `${apiBaseUrl}/api/v1/chat-activities/${session_id}`,
      {
        cache: "no-store", // Use standard fetch cache option
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!res.ok) {
      if (res.status === 404) {
        return { error: "Chat sudah dihapus atau diarsipkan." };
      }
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const json = await res.json();

    if (!json.chat_activity_data || !json.chat_activity_data.messages) {
      return { error: "Chat sudah dihapus atau diarsipkan." };
    }

    return {
      data: json.chat_activity_data.messages || [],
      session: json.session_id,
      publicID: json.publicID,
    };
  } catch (error) {
    console.error("Get Chat Session Error:", error);
    return {
      error: "Terjadi kesalahan saat mengambil sesi chat.",
      data: [],
    };
  }
}
