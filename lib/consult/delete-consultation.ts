"use server";

import { getAccessToken } from "@/app/[locale]/(auth)/actions/auth.actions";
import { apiSecretKey } from "@/helper/api-secret-key";
import { error } from "console";
import { da } from "date-fns/locale";
import { success } from "zod";
import { meta } from "zod/v4/core";

const apiBaseUrl =
  process.env.NODE_ENV === "production"
    ? process.env.NEXT_PUBLIC_PROD_BACKEND_URL
    : process.env.NEXT_PUBLIC_DEV_BACKEND_URL;

export async function deleteConsultation(id: string) {
  try {
    const accessToken = await getAccessToken();
    const res = await fetch(`${apiBaseUrl}/api/v1/admin/consultations/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "X-API-Key": apiSecretKey,
        "Content-Type": "application/json",
      },
    });

    const json = await res.json();

    if (res.status !== 200) {
      return {
        success: false,
        error: `Failed to delete consultation data. Cause : ${json.message}`,
      };
    }

    // console.log({ json });
    return {
      message: "Consultation deleted successfully.",
      success: true,
    };
  } catch (error) {
    console.error("Delete consultation data Error:", error);
    return {
      success: false,
      message: "Terjadi kesalahan saat terhubung ke server.",
    };
  }
}
