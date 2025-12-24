"use server";

import { error } from "console";
import { success } from "zod";
import { deleteMultipleFiles, deleteSingleFile } from "../image/deleteImage";
import { createClient } from "@/utils/supabase/client";
import { getArticlesByID } from "./get-articles";

const apiBaseUrl =
  process.env.NODE_ENV === "production"
    ? process.env.NEXT_PUBLIC_PROD_BACKEND_URL
    : process.env.NEXT_PUBLIC_DEV_BACKEND_URL;

export async function deleteArticles(id: string) {
  try {
    console.log("Sending articles/delete to BE:", id);
    const articlesData = (await getArticlesByID(id)).data.data;

    if (!articlesData)
      return { error: "Error articles/read in articles/delete ID:", id };

    const filesToDelete: string[] = [];

    // Highlight (array)
    if (articlesData.highlight_images?.length > 0) {
      filesToDelete.push(...articlesData.highlight_images);
    }

    if (filesToDelete.length === 1) {
      const deleteSingle = await deleteSingleFile(filesToDelete[0]);
      if (!deleteSingle) {
        return {
          error:
            "Error articles/read in articles/delete ID" +
            id +
            " when delete single images:" +
            filesToDelete,
        };
      }
    }

    const supabase = await createClient();

    const {
      data: deleteArticles,
      count,
      error: errorDeleteArticles,
    } = await supabase.from("article").delete({ count: "exact" }).eq("id", id);

    // const res = await fetch(`${apiBaseUrl}/api/v1/vendors/${id}`, {
    //   method: "DELETE",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    // });

    // const data = await res.json();

    // if (res.status !== 200) {
    //   return {
    //     success: false,
    //     error: `Failed to sent vendor/delete data. Cause : ${res.status} - ${data.message}`,
    //   };
    // }

    if (errorDeleteArticles) {
      return {
        error: errorDeleteArticles.message,
      };
    }

    return {
      deleteArticles,
      count,
      success: true,
    };
  } catch (error) {
    console.error("Sent articles/delete Error:", error);
    return {
      success: false,
      message: "Terjadi kesalahan saat terhubung ke server.",
    };
  }
}
