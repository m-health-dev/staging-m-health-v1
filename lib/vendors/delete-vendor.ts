"use server";

import { error } from "console";
import { success } from "zod";
import { getVendorByID } from "./get-vendor";
import { deleteMultipleFiles, deleteSingleFile } from "../image/deleteImage";
import { createClient } from "@/utils/supabase/client";

const apiBaseUrl =
  process.env.NODE_ENV === "production"
    ? process.env.NEXT_PUBLIC_PROD_BACKEND_URL
    : process.env.NEXT_PUBLIC_DEV_BACKEND_URL;

export async function deleteVendor(id: string) {
  try {
    console.log("Sending vendor/delete to BE:", id);
    const vendorData = (await getVendorByID(id)).data.data;

    if (!vendorData)
      return { error: "Error vendor/read in vendor/delete ID:", id };

    const filesToDelete: string[] = [];

    // Logo
    if (vendorData.logo) filesToDelete.push(vendorData.logo);

    // Highlight (array)
    if (vendorData.highlight_images?.length > 0) {
      filesToDelete.push(...vendorData.highlight_images);
    }

    // Reference images (array)
    if (vendorData.reference_images?.length > 0) {
      filesToDelete.push(...vendorData.reference_images);
    }

    if (filesToDelete.length === 1) {
      const deleteSingle = await deleteSingleFile(filesToDelete[0]);
      if (!deleteSingle) {
        return {
          error:
            "Error vendor/read in vendor/delete ID" +
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
            "Error vendor/read in vendor/delete ID" +
            id +
            " when delete multiple images:" +
            filesToDelete,
        };
      }
    }

    const supabase = await createClient();

    const {
      data: deleteVendor,
      count,
      error: errorDeleteVendor,
    } = await supabase.from("vendor").delete({ count: "exact" }).eq("id", id);

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

    if (errorDeleteVendor) {
      return {
        error: errorDeleteVendor.message,
      };
    }

    return {
      deleteVendor,
      count,
      success: true,
    };
  } catch (error) {
    console.error("Sent vendor/delete Error:", error);
    return {
      success: false,
      message: "Terjadi kesalahan saat terhubung ke server.",
    };
  }
}
