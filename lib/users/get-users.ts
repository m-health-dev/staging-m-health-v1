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

export async function getAllUsers(page: number = 1, per_page: number = 10) {
  const accessToken = await getAccessToken();
  try {
    const res = await fetch(
      `${apiBaseUrl}/api/v1/admin/users?page=${page}&per_page=${per_page}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "X-API-Key": apiSecretKey,
          "Content-Type": "application/json",
        },
      }
    );

    const json = await res.json();

    if (res.status !== 200) {
      return {
        success: false,
        data: [],
        links: null,
        meta: null,
        total: 0,
        error: `Failed to receive all users/read data. Cause : ${json.message}`,
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
    console.error("Receive all users/read Error:", error);
    return {
      success: false,
      data: [],
      links: null,
      meta: null,
      total: 0,
      message: "Terjadi kesalahan saat terhubung ke server.",
    };
  }
}

export async function getUserByID(id: string) {
  const accessToken = await getAccessToken();
  try {
    const res = await fetch(`${apiBaseUrl}/api/v1/admin/users/${id}`, {
      method: "GET",
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
        error: `Failed to receive user/read by ID ${id}. Cause : ${res.status} - ${json.message}`,
      };
    }

    return {
      data: json.data,
      success: true,
    };
  } catch (error) {
    console.error(`Receive user/id:${id} Error:`, error);
    return {
      success: false,
      message: "Terjadi kesalahan saat terhubung ke server.",
    };
  }
}
