import { createClient } from "@/utils/supabase/client";
import { success } from "zod";

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
