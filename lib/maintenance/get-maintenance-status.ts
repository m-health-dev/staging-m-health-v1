"use server";

import { getAccessToken } from "@/app/[locale]/(auth)/actions/auth.actions";
import { apiSecretKey } from "@/helper/api-secret-key";
import { UsersType } from "@/types/account.types";
import { error } from "console";
import { success } from "zod";

const apiBaseUrl =
  process.env.NODE_ENV === "production"
    ? process.env.NEXT_PUBLIC_PROD_BACKEND_URL
    : process.env.NEXT_PUBLIC_DEV_BACKEND_URL;

export async function getMaintenanceStatus() {
  try {
    const res = process.env.MAINTENANCE_MODE === "true" ? true : false;

    return {
      status: res,
      success: true,
    };
  } catch (error) {
    console.error("Receive maintenance status Error:", error);
    return {
      success: false,
      status: false,
      message: "Terjadi kesalahan saat terhubung ke server.",
    };
  }
}
