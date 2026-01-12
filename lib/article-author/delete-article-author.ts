"use server";

import { error } from "console";
import { success } from "zod";
import { getArticleAuthorByID } from "./get-article-author";
import { deleteMultipleFiles, deleteSingleFile } from "../image/deleteImage";
import { createClient } from "@/utils/supabase/client";
import { getAccessToken } from "@/app/[locale]/(auth)/actions/auth.actions";

const apiBaseUrl =
  process.env.NODE_ENV === "production"
    ? process.env.NEXT_PUBLIC_PROD_BACKEND_URL
    : process.env.NEXT_PUBLIC_DEV_BACKEND_URL;

export async function deleteArticleAuthor(id: string) {
  try {
    console.log("Sending author/delete to BE:", id);

    const accessToken = await getAccessToken();

    const res = await fetch(`${apiBaseUrl}/api/v1/authors/${id}`, {
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
        error: `Failed to sent article-author/delete data. Cause : ${res.status} - ${data.message}`,
      };
    }

    return {
      success: true,
      message: "Author deleted successfully!",
    };
  } catch (error) {
    console.error("Sent article-author/delete Error:", error);
    return {
      success: false,
      message: "Terjadi kesalahan saat terhubung ke server.",
    };
  }
}
