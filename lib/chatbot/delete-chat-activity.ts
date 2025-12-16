"use server";

const apiBaseUrl =
  process.env.NODE_ENV === "production"
    ? process.env.NEXT_PUBLIC_PROD_BACKEND_URL
    : process.env.NEXT_PUBLIC_DEV_BACKEND_URL;

export async function DeleteChatSession(session_id: string) {
  if (!session_id) {
    return { error: "Session ID is required" };
  }

  try {
    const res = await fetch(
      `${apiBaseUrl}/api/v1/chat-activities/${session_id}`,
      {
        cache: "no-store", // Use standard fetch cache option
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!res.ok) {
      if (res.status === 404) {
        return { success: false, error: "Chat sudah dihapus atau diarsipkan." };
      }
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    return {
      success: true,
      message: "Success Deleted Chat Session",
    };
  } catch (error) {
    console.error("Get Chat Session Error:", error);
    return {
      error: "Terjadi kesalahan saat mengambil sesi chat.",
      data: [],
    };
  }
}

export async function DeleteAllChatSession(user_id: string) {
  if (!user_id) {
    return { error: "User ID is required" };
  }

  try {
    const res = await fetch(
      `${apiBaseUrl}/api/v1/chat-activities/all/${user_id}`,
      {
        cache: "no-store", // Use standard fetch cache option
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!res.ok) {
      if (res.status === 404) {
        return { success: false, error: "Chat sudah dihapus atau diarsipkan." };
      }
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    return {
      success: true,
      message: "Successfuly Deleted All Chat Session based on Your User ID",
    };
  } catch (error) {
    console.error("Get Chat Session Error:", error);
    return {
      error: "Terjadi kesalahan saat mengambil sesi chat.",
      data: [],
    };
  }
}
