"use server";

import { getAccessToken } from "@/app/[locale]/(auth)/actions/auth.actions";
import { apiSecretKey } from "@/helper/api-secret-key";
import { error } from "console";
import { access } from "fs";
import { success } from "zod";

const apiBaseUrl =
  process.env.NODE_ENV === "production"
    ? process.env.NEXT_PUBLIC_PROD_BACKEND_URL
    : process.env.NEXT_PUBLIC_DEV_BACKEND_URL;

export async function getAllErrorLogs(page: number = 1, per_page: number = 10) {
  try {
    const accessToken = await getAccessToken();
    const res = await fetch(
      `${apiBaseUrl}/api/v1/error-logs?page=${page}&per_page=${per_page}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "X-API-Key": apiSecretKey,
          "Content-Type": "application/json",
        },
      },
    );

    const json = await res.json();

    if (res.status !== 200) {
      return {
        success: false,
        error: `Failed to receive error-logs/read data. Cause : ${json.message}`,
      };
    }

    // console.log(json.links);
    return {
      data: json.data,
      links: json.links,
      meta: json.meta,
      total: json.meta.total,
      success: true,
    };
  } catch (error) {
    console.error("Receive error-logs/read Error:", error);
    return {
      success: false,
      message: "Terjadi kesalahan saat terhubung ke server.",
    };
  }
}

export async function getErrorLogByID(id: string) {
  try {
    const accessToken = await getAccessToken();
    const res = await fetch(`${apiBaseUrl}/api/v1/error-logs/${id}`, {
      method: "GET",
      // next: { revalidate: 60 },
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "X-API-Key": apiSecretKey,
        "Content-Type": "application/json",
      },
    });

    const json = await res.json();
    // console.log({ json });

    if (res.status !== 200) {
      return {
        success: false,
        error: `Failed to receive error-logs/read by ID ${id}. Cause : ${res.status} - ${json.message}`,
      };
    }

    return {
      data: json.data,
      success: true,
    };
  } catch (error) {
    console.error(`Receive error-logs/id:${id} Error:`, error);
    return {
      success: false,
      message: "Terjadi kesalahan saat terhubung ke server.",
    };
  }
}
