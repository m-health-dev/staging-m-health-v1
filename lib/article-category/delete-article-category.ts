"use server";

import { error } from "console";
import { success } from "zod";
import { getArticleCategoryByID } from "./get-article-category";
import { deleteMultipleFiles, deleteSingleFile } from "../image/deleteImage";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { getLocale } from "next-intl/server";

const apiBaseUrl =
  process.env.NODE_ENV === "production"
    ? process.env.NEXT_PUBLIC_PROD_BACKEND_URL
    : process.env.NEXT_PUBLIC_DEV_BACKEND_URL;

export async function deleteArticleCategory(id: string) {
  try {
    console.log("Sending article-category/delete to BE:", id);
    const categoryData = (await getArticleCategoryByID(id)).data.data;

    const supabase = await createClient();

    const { data: categoryDataInSupabase } = await supabase
      .from("article_category")
      .select("*")
      .eq("id", id)
      .single();

    if (!categoryDataInSupabase)
      return {
        error: "Error article-category/read in article-category/delete ID:",
        id,
      };

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

    const locale = await getLocale();
    revalidatePath(`/${locale}/studio/article/category`);

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
