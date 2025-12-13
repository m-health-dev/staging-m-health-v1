"use server";

import { error } from "console";
import { success } from "zod";
import { deleteMultipleFiles, deleteSingleFile } from "../image/deleteImage";
import { createClient } from "@/utils/supabase/client";
import { getPackageByID } from "./get-packages";

const apiBaseUrl =
  process.env.NODE_ENV === "production"
    ? process.env.NEXT_PUBLIC_PROD_BACKEND_URL
    : process.env.NEXT_PUBLIC_DEV_BACKEND_URL;

export async function deletePackage(id: string) {
  try {
    console.log("Sending package/delete to BE:", id);
    const packageData = (await getPackageByID(id)).data.data;

    if (!packageData)
      return { error: "Error package/read in package/delete ID:", id };

    const filesToDelete: string[] = [];

    // Highlight (array)
    if (packageData.highlight_images?.length > 0) {
      filesToDelete.push(...packageData.highlight_images);
    }

    // Reference images (array)
    if (packageData.reference_images?.length > 0) {
      filesToDelete.push(...packageData.reference_images);
    }

    if (filesToDelete.length === 1) {
      const deleteSingle = await deleteSingleFile(filesToDelete[0]);
      if (!deleteSingle) {
        return {
          error:
            "Error package/read in package/delete ID" +
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
            "Error package/read in package/delete ID" +
            id +
            " when delete multiple images:" +
            filesToDelete,
        };
      }
    }

    const supabase = await createClient();

    const {
      data: deletePackage,
      count,
      error: errorDeletePackage,
    } = await supabase.from("packages").delete({ count: "exact" }).eq("id", id);

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

    if (errorDeletePackage) {
      return {
        error: errorDeletePackage.message,
      };
    }

    return {
      deletePackage,
      count,
      success: true,
    };
  } catch (error) {
    console.error("Sent package/delete Error:", error);
    return {
      success: false,
      message: "Terjadi kesalahan saat terhubung ke server.",
    };
  }
}
