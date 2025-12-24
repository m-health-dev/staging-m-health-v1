"use server";

import { error } from "console";
import { success } from "zod";
import { getArticleAuthorByID } from "./get-article-author";
import { deleteMultipleFiles, deleteSingleFile } from "../image/deleteImage";
import { createClient } from "@/utils/supabase/client";

const apiBaseUrl =
  process.env.NODE_ENV === "production"
    ? process.env.NEXT_PUBLIC_PROD_BACKEND_URL
    : process.env.NEXT_PUBLIC_DEV_BACKEND_URL;

export async function deleteArticleAuthor(id: string) {
  try {
    console.log("Sending author/delete to BE:", id);
    const authorData = (await getArticleAuthorByID(id)).data.data;

    if (!authorData)
      return { error: "Error author/read in author/delete ID:", id };

    const filesToDelete: string[] = [];

    // Logo
    if (authorData.logo) filesToDelete.push(authorData.logo);

    // Highlight (array)
    if (authorData.highlight_images?.length > 0) {
      filesToDelete.push(...authorData.highlight_images);
    }

    // Reference images (array)
    if (authorData.reference_images?.length > 0) {
      filesToDelete.push(...authorData.reference_images);
    }

    if (filesToDelete.length === 1) {
      const deleteSingle = await deleteSingleFile(filesToDelete[0]);
      if (!deleteSingle) {
        return {
          error:
            "Error article-author/read in article-author/delete ID" +
            id +
            " when delete single images:" +
            filesToDelete,
        };
      }
    } else if (filesToDelete.length > 1) {
      const deleteMultiple = await deleteMultipleFiles(filesToDelete);
      if (!deleteMultiple) {
        return {
          error:
            "Error article-author/read in article-author/delete ID" +
            id +
            " when delete multiple images:" +
            filesToDelete,
        };
      }
    }

    const supabase = await createClient();

    const {
      data: deleteAuthor,
      count,
      error: errorDeleteAuthor,
    } = await supabase.from("author").delete({ count: "exact" }).eq("id", id);

    // const res = await fetch(`${apiBaseUrl}/api/v1/authors/${id}`, {
    //   method: "DELETE",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    // });

    // const data = await res.json();

    // if (res.status !== 200) {
    //   return {
    //     success: false,
    //     error: `Failed to sent article-author/delete data. Cause : ${res.status} - ${data.message}`,
    //   };
    // }

    if (errorDeleteAuthor) {
      return {
        error: errorDeleteAuthor.message,
      };
    }

    return {
      deleteAuthor,
      count,
      success: true,
    };
  } catch (error) {
    console.error("Sent article-author/delete Error:", error);
    return {
      success: false,
      message: "Terjadi kesalahan saat terhubung ke server.",
    };
  }
}
