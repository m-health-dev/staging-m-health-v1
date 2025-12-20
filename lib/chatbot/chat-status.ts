"use server";

import { apiSecretKey } from "@/helper/api-secret-key";
import { createClient } from "@/utils/supabase/server";
import { success } from "zod";

const apiBaseUrl =
  process.env.NODE_ENV === "production"
    ? process.env.NEXT_PUBLIC_PROD_BACKEND_URL
    : process.env.NEXT_PUBLIC_DEV_BACKEND_URL;

export async function ChangeChatStatus(session_id: string, statusSend: string) {
  if (!session_id) {
    return { error: "Session ID is required" };
  }

  try {
    const supabase = await createClient();
    const { data: sessionData, error: sessionError } =
      await supabase.auth.getSession();
    const res = await fetch(
      `${apiBaseUrl}/api/v1/chat-activities/${session_id}`,
      {
        method: "PATCH",
        headers: {
          "X-API-Key": apiSecretKey,
          Authorization: `Bearer ${sessionData.session?.access_token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: statusSend }),
      }
    );

    if (!res.ok) {
      if (res.status === 404) {
        return {
          success: false,
          req: res,
          error: "Gagal Mengubah status chat. Sesi tidak ditemukan.",
        };
      }
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const json = await res.json();

    console.log({ res, json });

    if (!json) {
      return { success: false, error: "Gagal Mengubah status chat." };
    }

    return {
      success: true,
      data: json.share_slug,
    };
  } catch (error) {
    console.error("Share Chat Session Error:", error);
    return {
      error: "Terjadi kesalahan saat mengambil sesi chat.",
      data: [],
    };
  }
}

export async function SetChatStatus(status: string, sessionID: string) {
  const supabase = await createClient();

  try {
    const { data: set, error } = await supabase
      .from("chat_activity")
      .update({
        status: status,
      })
      .eq("id", sessionID);

    if (error) {
      return {
        success: false,
        error: "Failed to change chat session status.",
      };
    }

    return {
      success: false,
      data: set,
      message: "Success to change chat session status.",
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      error: "Failed to change chat session status.",
    };
  }
}

export async function GetChatStatus(sessionID: string) {
  const supabase = await createClient();

  try {
    const { data: get, error } = await supabase
      .from("chat_activity")
      .select("status")
      .eq("id", sessionID)
      .maybeSingle();

    if (error) {
      return {
        success: false,
        error: "Failed to get chat session status.",
      };
    }

    if (!get) {
      return {
        success: false,
        error: "Chat session not found.",
      };
    }

    return {
      success: true,
      data: get.status,
      message: "Success to get chat session status.",
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      error: "Failed to get chat session status.",
    };
  }
}
