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

export async function getConsultationSlot(date: string) {
  try {
    const res = await fetch(
      `${apiBaseUrl}/api/v1/consultations/available-slots?date=${date}`,
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
        error: `Failed to receive ALL consultation slot data. Cause : ${json.message}`,
      };
    }

    // console.log({ json });
    return {
      data: json,
      success: true,
    };
  } catch (error) {
    console.error("Receive ALL consultation slot data Error:", error);
    return {
      success: false,
      message: "Terjadi kesalahan saat terhubung ke server.",
    };
  }
}

export async function getConsultationByID(id: string) {
  try {
    const accessToken = await getAccessToken();
    const res = await fetch(`${apiBaseUrl}/api/v1/consultations/${id}`, {
      method: "GET",
      headers: {
        "X-API-Key": apiSecretKey,
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    const json = await res.json();

    if (res.status !== 200) {
      return {
        success: false,
        error: `Failed to receive consultation data. Cause : ${json.message}`,
      };
    }

    // console.log({ json });
    return {
      data: json,
      success: true,
    };
  } catch (error) {
    console.error("Receive consultation data Error:", error);
    return {
      success: false,
      message: "Terjadi kesalahan saat terhubung ke server.",
    };
  }
}

export async function getConsultationPrice() {
  try {
    const res = await fetch(`${apiBaseUrl}/api/v1/consultation-price`, {
      method: "GET",
      headers: {
        "X-API-Key": apiSecretKey,
        "Content-Type": "application/json",
      },
    });

    const json = await res.json();

    if (res.status !== 200) {
      return {
        success: false,
        error: `Failed to receive consultation price data. Cause : ${json.message}`,
      };
    }

    // console.log({ json });
    return {
      data: json,
      success: true,
    };
  } catch (error) {
    console.error("Receive consultation price data Error:", error);
    return {
      success: false,
      message: "Terjadi kesalahan saat terhubung ke server.",
    };
  }
}

export async function getMyConsultations(
  page: number = 1,
  per_page: number = 10
) {
  try {
    const accessToken = await getAccessToken();
    const res = await fetch(
      `${apiBaseUrl}/api/v1/consultations/my?page=${page}&per_page=${per_page}`,
      {
        method: "GET",
        headers: {
          "X-API-Key": apiSecretKey,
          Authorization: `Bearer ${accessToken}`,
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
        error: `Failed to receive my consultation data. Cause : ${json.message}`,
      };
    }

    // console.log({ json });
    return {
      data: json.data,
      meta: json.meta,
      links: json.links,
      success: true,
    };
  } catch (error) {
    console.error("Receive my consultation data Error:", error);
    return {
      success: false,
      data: [],
      meta: null,
      links: null,
      message: "Terjadi kesalahan saat terhubung ke server.",
    };
  }
}

export async function getMyConsultationsByID(id: string) {
  try {
    const accessToken = await getAccessToken();
    const res = await fetch(`${apiBaseUrl}/api/v1/consultations/${id}`, {
      method: "GET",
      headers: {
        "X-API-Key": apiSecretKey,
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    const json = await res.json();

    if (res.status !== 200) {
      return {
        success: false,
        data: [],
        error: `Failed to receive my consultation by id data. Cause : ${json.message}`,
      };
    }

    // console.log({ json });
    return {
      data: json.data,
      success: true,
    };
  } catch (error) {
    console.error("Receive my consultation by id data Error:", error);
    return {
      success: false,
      data: [],
      meta: null,
      links: null,
      message: "Terjadi kesalahan saat terhubung ke server.",
    };
  }
}

export async function getAllConsultations(
  page: number = 1,
  per_page: number = 10
) {
  try {
    const accessToken = await getAccessToken();
    const res = await fetch(
      `${apiBaseUrl}/api/v1/consultations?page=${page}&per_page=${per_page}`,
      {
        method: "GET",
        headers: {
          "X-API-Key": apiSecretKey,
          Authorization: `Bearer ${accessToken}`,
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
        error: `Failed to receive All consultation data. Cause : ${json.message}`,
      };
    }

    // console.log({ json });
    return {
      data: json.data,
      meta: json.meta,
      links: json.links,
      total: json.meta?.total || 0,
      success: true,
    };
  } catch (error) {
    console.error("Receive All consultation data Error:", error);
    return {
      success: false,
      data: [],
      meta: null,
      links: null,
      message: "Terjadi kesalahan saat terhubung ke server.",
    };
  }
}
