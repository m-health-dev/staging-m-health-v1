"use server";

import { Message } from "@/components/chatbot/ChatStart";
import { error } from "console";
import { success } from "zod";
import { getHotelByID } from "./get-hotel";
import { deleteMultipleFiles, deleteSingleFile } from "../image/deleteImage";
import { createClient } from "@/utils/supabase/client";

const apiBaseUrl =
  process.env.NODE_ENV === "production"
    ? process.env.NEXT_PUBLIC_PROD_BACKEND_URL
    : process.env.NEXT_PUBLIC_DEV_BACKEND_URL;

export async function deleteHotel(id: string) {
  try {
    console.log("Sending hotel/delete to BE:", id);
    const hotelData = (await getHotelByID(id)).data.data;

    if (!hotelData)
      return { error: "Error hotel/read in hotel/delete ID:", id };

    const filesToDelete: string[] = [];

    // Logo
    if (hotelData.logo) filesToDelete.push(hotelData.logo);

    // Highlight (array)
    if (hotelData.highlight_images?.length > 0) {
      filesToDelete.push(...hotelData.highlight_images);
    }

    // Reference images (array)
    if (hotelData.reference_images?.length > 0) {
      filesToDelete.push(...hotelData.reference_images);
    }

    if (filesToDelete.length === 1) {
      const deleteSingle = await deleteSingleFile(filesToDelete[0]);
      if (!deleteSingle) {
        return {
          error:
            "Error hotel/read in hotel/delete ID" +
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
            "Error hotel/read in hotel/delete ID" +
            id +
            " when delete multiple images:" +
            filesToDelete,
        };
      }
    }

    const supabase = await createClient();

    const {
      data: deleteHotel,
      count,
      error: errorDeleteHotel,
    } = await supabase.from("hotel").delete({ count: "exact" }).eq("id", id);

    // const res = await fetch(`${apiBaseUrl}/api/v1/hotels/${id}`, {
    //   method: "DELETE",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    // });

    // const data = await res.json();

    // if (res.status !== 200) {
    //   return {
    //     success: false,
    //     error: `Failed to sent hotel/delete data. Cause : ${res.status} - ${data.message}`,
    //   };
    // }

    if (errorDeleteHotel) {
      return {
        error: errorDeleteHotel.message,
      };
    }

    return {
      deleteHotel,
      count,
      success: true,
    };
  } catch (error) {
    console.error("Sent hotel/delete Error:", error);
    return {
      success: false,
      message: "Terjadi kesalahan saat terhubung ke server.",
    };
  }
}
