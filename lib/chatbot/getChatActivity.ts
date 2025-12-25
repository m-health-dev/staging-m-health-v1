"use server";

import { getAccessToken } from "@/app/[locale]/(auth)/actions/auth.actions";
import { apiSecretKey } from "@/helper/api-secret-key";
import { createClient } from "@/utils/supabase/client";
import { link } from "node:fs";
import { success } from "zod";
import { meta } from "zod/v4/core";

const apiBaseUrl =
  process.env.NODE_ENV === "production"
    ? process.env.NEXT_PUBLIC_PROD_BACKEND_URL
    : process.env.NEXT_PUBLIC_DEV_BACKEND_URL;

export async function getAllChatActivity(
  page: number = 1,
  per_page: number = 10
) {
  const accessToken = await getAccessToken();
  try {
    const res = await fetch(
      `${apiBaseUrl}/api/v1/chat-activities?page=${page}&per_page=${per_page}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "X-API-Key": apiSecretKey,
          "Content-Type": "application/json",
        },
      }
    );

    const json = await res.json();

    const data = json.data;

    // console.log({ res, data });

    if (res.status !== 200) {
      return {
        success: false,
        error: `Failed to receive chat-activities/read data. Cause : ${json.message}`,
      };
    }

    // console.log(json.links);
    return {
      data: json.data,
      links: json.links,
      meta: json.meta,
      total: json.total,
      success: true,
    };
  } catch (error) {
    console.error("Receive chat-activities/read Error:", error);
    return {
      success: false,
      message: "Terjadi kesalahan saat terhubung ke server.",
    };
  }
}

export async function getShareSlug(session_id: string) {
  const supabase = await createClient();

  try {
    const { data, error } = await supabase
      .from("chat_activity")
      .select("id, share_slug")
      .eq("id", session_id)
      .maybeSingle();

    if (error) {
      return {
        success: false,
        error: "Failed to get Share Slug",
      };
    }

    // console.log("Slug Data: ", data);

    return {
      success: true,
      data: data?.id,
      shareSlug: data?.share_slug,
      message: `Success to get Share Slug for Chat Session: ${session_id}`,
    };
  } catch (error) {
    console.error("Failed to get Share Slug", error);
    return {
      success: false,
      error: "Failed to get Share Slug",
      cause: error,
    };
  }
}

export async function getChatHistory(
  public_id: string,
  page: number,
  per_page: number
) {
  if (!public_id) {
    return { data: [], total: 0 };
  }

  try {
    const res = await fetch(
      `${apiBaseUrl}/api/v1/chat-activities/all/${public_id}?page=${page}&per_page=${per_page}`,
      {
        cache: "no-store", // Use standard fetch cache option
        method: "GET",
        headers: {
          "X-API-Key": apiSecretKey,
          "Content-Type": "application/json",
        },
      }
    );

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const json = await res.json();

    return {
      data: json,
      meta: json.meta,
      links: json.links,
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

export async function getChatHistoryByUserID(
  user_id: string,
  page: number,
  per_page: number
) {
  if (!user_id) {
    return { data: [], total: 0 };
  }

  try {
    const res = await fetch(
      `${apiBaseUrl}/api/v1/chat-activities/all/${user_id}?page=${page}&per_page=${per_page}`,
      {
        cache: "no-store", // Use standard fetch cache option
        method: "GET",
        headers: {
          "X-API-Key": apiSecretKey,
          "Content-Type": "application/json",
        },
      }
    );

    if (!res.ok) {
      throw new Error(`HTTP error! by User ID status: ${res.status}`);
    }

    const json = await res.json();

    // console.log({ json });

    return {
      data: json,
      meta: json.meta,
      links: json.links,
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
          "X-API-Key": apiSecretKey,
          "Content-Type": "application/json",
        },
      }
    );

    if (!res.ok) {
      if (res.status === 404) {
        return {
          success: false,
          req: res,
          error: "Chat sudah dihapus atau diarsipkan.",
        };
      }
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const json = await res.json();

    if (
      !json.data.chat_activity_data ||
      !json.data.chat_activity_data.messages
    ) {
      return { error: "Chat sudah dihapus atau diarsipkan." };
    }

    return {
      success: true,
      status: res.status,
      all: json,
      data: json.data.chat_activity_data.messages || [],
      session: json.data.chat_activity_data.id,
      publicID: json.data.public_id,
      publicStatus: json.data.status,
      urgent: json.data.chat_activity_data.urgent,
    };
  } catch (error) {
    console.error("Get Chat Session Error:", error);
    return {
      error: "Terjadi kesalahan saat mengambil sesi chat.",
      data: [],
    };
  }
}

export async function getChatSessionBySlug(slug: string) {
  if (!slug) {
    return { error: "Slug is required" };
  }

  try {
    const res = await fetch(`${apiBaseUrl}/api/v1/chat-activities/${slug}`, {
      cache: "no-store", // Use standard fetch cache option
      method: "GET",
      headers: {
        "X-API-Key": apiSecretKey,
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      if (res.status === 404) {
        return {
          success: false,
          req: res,
          error: "Chat (Share) sudah dihapus atau diarsipkan. (404)",
        };
      }
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const json = await res.json();

    // console.log(res);

    if (
      !json.data.chat_activity_data ||
      !json.data.chat_activity_data.messages
    ) {
      return { error: "Chat (Share) sudah dihapus atau diarsipkan. (500)" };
    }

    return {
      success: true,
      status: res.status,
      all: json,
      data: json.data.chat_activity_data.messages || [],
      session: json.data.chat_activity_data.id,
      publicID: json.data.public_id,
      publicStatus: json.data.status,
      urgent: json.data.chat_activity_data.urgent,
    };
  } catch (error) {
    console.error("Get Chat Session Error:", error);
    return {
      error: "Terjadi kesalahan saat mengambil sesi chat.",
      data: [],
    };
  }
}
