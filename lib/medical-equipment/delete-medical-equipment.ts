"use server";

import { error } from "console";
import { success } from "zod";
import { deleteMultipleFiles, deleteSingleFile } from "../image/deleteImage";
import { createClient } from "@/utils/supabase/client";
import { getMedicalEquipmentByID } from "./get-medical-equipment";

const apiBaseUrl =
  process.env.NODE_ENV === "production"
    ? process.env.NEXT_PUBLIC_PROD_BACKEND_URL
    : process.env.NEXT_PUBLIC_DEV_BACKEND_URL;

export async function deleteMedicalEquipment(id: string) {
  try {
    console.log("Sending equipment/delete to BE:", id);
    const medicalData = (await getMedicalEquipmentByID(id)).data.data;

    if (!medicalData)
      return { error: "Error equipment/read in equipment/delete ID:", id };

    const filesToDelete: string[] = [];

    // Highlight (array)
    if (medicalData.highlight_images?.length > 0) {
      filesToDelete.push(...medicalData.highlight_images);
    }

    // Reference images (array)
    if (medicalData.reference_images?.length > 0) {
      filesToDelete.push(...medicalData.reference_images);
    }

    if (filesToDelete.length === 1) {
      const deleteSingle = await deleteSingleFile(filesToDelete[0]);
      if (!deleteSingle) {
        return {
          error:
            "Error equipment/read in equipment/delete ID" +
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
            "Error equipment/read in equipment/delete ID" +
            id +
            " when delete multiple images:" +
            filesToDelete,
        };
      }
    }

    const supabase = await createClient();

    const {
      data: deleteMedicalEquipment,
      count,
      error: errorDeleteMedicalEqp,
    } = await supabase
      .from("medical-equipment")
      .delete({ count: "exact" })
      .eq("id", id);

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

    if (errorDeleteMedicalEqp) {
      return {
        error: errorDeleteMedicalEqp.message,
      };
    }

    return {
      deleteMedicalEquipment,
      count,
      success: true,
    };
  } catch (error) {
    console.error("Sent equipment/delete Error:", error);
    return {
      success: false,
      message: "Terjadi kesalahan saat terhubung ke server.",
    };
  }
}
