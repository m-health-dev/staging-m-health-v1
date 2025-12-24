"use server";

import { error } from "console";
import { success } from "zod";
import { getArticleCategoryByID } from "./get-article-category";
import { deleteMultipleFiles, deleteSingleFile } from "../image/deleteImage";
import { createClient } from "@/utils/supabase/client";

const apiBaseUrl =
  process.env.NODE_ENV === "production"
    ? process.env.NEXT_PUBLIC_PROD_BACKEND_URL
    : process.env.NEXT_PUBLIC_DEV_BACKEND_URL;

export async function deleteArticleCategory(id: string) {
  try {
    console.log("Sending article-category/delete to BE:", id);
    const categoryData = (await getArticleCategoryByID(id)).data.data;

    if (!categoryData)
      return {
        error: "Error article-category/read in article-category/delete ID:",
        id,
      };

    const supabase = await createClient();

    const {
      data: deleteArticleCategory,
      count,
      error: errorDeleteArticleCategory,
    } = await supabase
      .from("article_category")
      .delete({ count: "exact" })
      .eq("id", id);

    if (errorDeleteArticleCategory) {
      return {
        error: errorDeleteArticleCategory.message,
      };
    }

    return {
      deleteArticleCategory,
      count,
      success: true,
    };
  } catch (error) {
    console.error("Sent article-category/delete Error:", error);
    return {
      success: false,
      message: "Terjadi kesalahan saat terhubung ke server.",
    };
  }
}
