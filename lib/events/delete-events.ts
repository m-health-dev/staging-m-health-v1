"use server";

import { error } from "console";
import { success } from "zod";
import { deleteMultipleFiles, deleteSingleFile } from "../image/deleteImage";
import { createClient } from "@/utils/supabase/client";
import { getEventByID } from "./get-events";

const apiBaseUrl =
  process.env.NODE_ENV === "production"
    ? process.env.NEXT_PUBLIC_PROD_BACKEND_URL
    : process.env.NEXT_PUBLIC_DEV_BACKEND_URL;

export async function deleteEvent(id: string) {
  try {
    console.log("Sending event/delete to BE:", id);
    const EventData = (await getEventByID(id)).data.data;

    if (!EventData)
      return { error: "Error event/read in event/delete ID:", id };

    const filesToDelete: string[] = [];

    // Highlight (array)
    if (EventData.highlight_images?.length > 0) {
      filesToDelete.push(...EventData.highlight_images);
    }

    // Reference images (array)
    if (EventData.reference_images?.length > 0) {
      filesToDelete.push(...EventData.reference_images);
    }

    if (filesToDelete.length === 1) {
      const deleteSingle = await deleteSingleFile(filesToDelete[0]);
      if (!deleteSingle) {
        return {
          error:
            "Error event/read in event/delete ID" +
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
            "Error event/read in event/delete ID" +
            id +
            " when delete multiple images:" +
            filesToDelete,
        };
      }
    }

    const supabase = await createClient();

    const {
      data: deleteEvent,
      count,
      error: errorDeleteEvent,
    } = await supabase.from("events").delete({ count: "exact" }).eq("id", id);

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

    if (errorDeleteEvent) {
      return {
        error: errorDeleteEvent.message,
      };
    }

    return {
      deleteEvent,
      count,
      success: true,
    };
  } catch (error) {
    console.error("Sent event/delete Error:", error);
    return {
      success: false,
      message: "Terjadi kesalahan saat terhubung ke server.",
    };
  }
}
