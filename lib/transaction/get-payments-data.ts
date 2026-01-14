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

export async function getAllPaymentsRecord(
  page: number = 1,
  per_page: number = 10
) {
  try {
    const accessToken = await getAccessToken();
    const res = await fetch(
      `${apiBaseUrl}/api/v1/payments?page=${page}&per_page=${per_page}`,
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
        meta: null,
        links: null,
        total: 0,
        error: `Failed to receive all transactions/read data. Cause : ${json.message}`,
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
    console.error("Receive all transactions/read Error:", error);
    return {
      success: false,
      data: [],
      meta: null,
      links: null,
      total: 0,
      message: "Terjadi kesalahan saat terhubung ke server.",
    };
  }
}

export async function getPaymentsByOrderID(order_id: string) {
  try {
    const res = await fetch(
      `${apiBaseUrl}/api/v1/payments/by-order/${order_id}`,
      {
        method: "GET",
        headers: {
          "X-API-Key": apiSecretKey,
          "Content-Type": "application/json",
        },
      }
    );

    const json = await res.json();

    if (res.status !== 200) {
      return {
        success: false,
        data: null,
        error: `Failed to receive all transactions/read by order_id data. Cause : ${json.message}`,
      };
    }

    // console.log(json.links);
    return {
      data: json,
      success: true,
    };
  } catch (error) {
    console.error("Receive all transactions/read by order_id Error:", error);
    return {
      success: false,
      data: null,
      message: "Terjadi kesalahan saat terhubung ke server.",
    };
  }
}

export async function getPaymentsByUser(
  user_id: string,
  page: number = 1,
  per_page: number = 10
) {
  try {
    const accessToken = await getAccessToken();
    const res = await fetch(
      `${apiBaseUrl}/api/v1/payments/by-user/${user_id}?page=${page}&per_page=${per_page}`,
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
        data: null,
        error: `Failed to receive all transactions/read by user_id data. Cause : ${json.message}`,
      };
    }

    // console.log(json.links);
    return {
      data: json.data,
      links: json.links,
      meta: json.meta,
      success: true,
    };
  } catch (error) {
    console.error("Receive all transactions/read by user_id Error:", error);
    return {
      success: false,
      data: null,
      message: "Terjadi kesalahan saat terhubung ke server.",
    };
  }
}
