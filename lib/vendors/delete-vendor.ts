import { Message } from "@/components/chatbot/ChatStart";
import { error } from "console";
import { success } from "zod";
import { getVendorByID } from "./get-vendor";
import { deleteMultipleFiles, deleteSingleFile } from "../image/deleteImage";

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
            "when delete single images:" +
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
            "when delete multiple images:" +
            filesToDelete,
        };
      }
    }

    const res = await fetch(`${apiBaseUrl}/api/v1/vendors/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await res.json();

    if (!data) {
      return { success: false, error: "Failed to sent vendor/delete data." };
    }

    return {
      data,
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
