"use server";

import { error } from "console";
import { success } from "zod";
import { getWellnessByID } from "./get-wellness";
import { deleteMultipleFiles, deleteSingleFile } from "../image/deleteImage";
import { createClient } from "@/utils/supabase/client";

const apiBaseUrl =
  process.env.NODE_ENV === "production"
    ? process.env.NEXT_PUBLIC_PROD_BACKEND_URL
    : process.env.NEXT_PUBLIC_DEV_BACKEND_URL;

export async function deleteWellness(id: string) {
  try {
    console.log("Sending wellness/delete to BE:", id);
    const wellnessData = (await getWellnessByID(id)).data.data;

    if (!wellnessData)
      return { error: "Error wellness/read in wellness/delete ID:", id };

    const filesToDelete: string[] = [];

    // Highlight (array)
    if (wellnessData.highlight_images?.length > 0) {
      filesToDelete.push(...wellnessData.highlight_images);
    }

    // Reference images (array)
    if (wellnessData.reference_images?.length > 0) {
      filesToDelete.push(...wellnessData.reference_images);
    }

    if (filesToDelete.length === 1) {
      const deleteSingle = await deleteSingleFile(filesToDelete[0]);
      if (!deleteSingle) {
        return {
          error:
            "Error wellness/read in wellness/delete ID" +
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
            "Error wellness/read in wellness/delete ID" +
            id +
            " when delete multiple images:" +
            filesToDelete,
        };
      }
    }

    const supabase = await createClient();

    const {
      data: deleteWellness,
      count,
      error: errorDeleteWellness,
    } = await supabase.from("wellness").delete({ count: "exact" }).eq("id", id);

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

    if (errorDeleteWellness) {
      return {
        error: errorDeleteWellness.message,
      };
    }

    return {
      deleteWellness,
      count,
      success: true,
    };
  } catch (error) {
    console.error("Sent wellness/delete Error:", error);
    return {
      success: false,
      message: "Terjadi kesalahan saat terhubung ke server.",
    };
  }
}
