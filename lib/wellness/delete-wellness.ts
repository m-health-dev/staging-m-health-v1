"use server";

import { error } from "console";
import { success } from "zod";
import { getWellnessByID } from "./get-wellness";
import { deleteMultipleFiles, deleteSingleFile } from "../image/deleteImage";
import { createClient } from "@/utils/supabase/client";
import { getAccessToken } from "@/app/[locale]/(auth)/actions/auth.actions";

const apiBaseUrl =
  process.env.NODE_ENV === "production"
    ? process.env.NEXT_PUBLIC_PROD_BACKEND_URL
    : process.env.NEXT_PUBLIC_DEV_BACKEND_URL;

export async function deleteWellness(id: string) {
  try {
    console.log("Sending wellness/delete to BE:", id);

    const accessToken = await getAccessToken();

    const res = await fetch(`${apiBaseUrl}/api/v1/wellness/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    const data = await res.json();

    if (res.status !== 200) {
      return {
        success: false,
        error: `Failed to sent wellness/delete data. Cause : ${res.status} - ${data.message}`,
      };
    }

    return {
      success: true,
      message: "Wellness deleted successfully!",
    };
  } catch (error) {
    console.error("Sent wellness/delete Error:", error);
    return {
      success: false,
      message: "Terjadi kesalahan saat terhubung ke server.",
    };
  }
}
