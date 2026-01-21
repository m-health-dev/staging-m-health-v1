"use server";

import { apiSecretKey } from "@/helper/api-secret-key";
import { error } from "console";
import { success } from "zod";

const apiBaseUrl =
  process.env.NODE_ENV === "production"
    ? process.env.NEXT_PUBLIC_PROD_BACKEND_URL
    : process.env.NEXT_PUBLIC_DEV_BACKEND_URL;

export async function getAllInsuranceWithoutPagination() {
  try {
    const res = await fetch(`${apiBaseUrl}/api/v1/insurance?per_page=all`, {
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
        error: `Failed to receive ALL insurance/read data. Cause : ${json.message}`,
      };
    }

    console.log({ json });
    return {
      data: json.data,
      success: true,
    };
  } catch (error) {
    console.error("Receive ALL insurance/read Error:", error);
    return {
      success: false,
      message: "Terjadi kesalahan saat terhubung ke server.",
    };
  }
}

export async function getAllInsurance(page: number = 1, per_page: number = 10) {
  try {
    const res = await fetch(
      `${apiBaseUrl}/api/v1/insurance?page=${page}&per_page=${per_page}`,
      {
        method: "GET",
        headers: {
          "X-API-Key": apiSecretKey,
          "Content-Type": "application/json",
        },
      },
    );

    const json = await res.json();

    if (res.status !== 200) {
      return {
        success: false,
        error: `Failed to receive insurance/read data. Cause : ${json.message}`,
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
    console.error("Receive insurance/read Error:", error);
    return {
      success: false,
      message: "Terjadi kesalahan saat terhubung ke server.",
    };
  }
}

export async function getInsuranceByID(id: string) {
  try {
    const res = await fetch(`${apiBaseUrl}/api/v1/insurance/${id}`, {
      method: "GET",
      next: { revalidate: 60 },
      headers: {
        "X-API-Key": apiSecretKey,
        "Content-Type": "application/json",
      },
    });

    const json = await res.json();
    // console.log({ json });

    if (res.status !== 200) {
      return {
        success: false,
        error: `Failed to receive insurance/read by ID ${id}. Cause : ${res.status} - ${json.message}`,
      };
    }

    return {
      data: json.data,
      success: true,
    };
  } catch (error) {
    console.error(`Receive insurance/id:${id} Error:`, error);
    return {
      success: false,
      message: "Terjadi kesalahan saat terhubung ke server.",
    };
  }
}

export async function getInsuranceBySlug(slug: string) {
  try {
    const res = await fetch(`${apiBaseUrl}/api/v1/insurance/${slug}`, {
      method: "GET",
      next: { revalidate: 60 },
      headers: {
        "X-API-Key": apiSecretKey,
        "Content-Type": "application/json",
      },
    });

    const data = await res.json();

    if (res.status !== 200) {
      return {
        success: false,
        error: `Failed to receive insurance/read by slug ${slug}. Cause : ${res.status} - ${data.message}`,
      };
    }

    return {
      data,
      success: true,
    };
  } catch (error) {
    console.error(`Receive insurance/slug:${slug} Error:`, error);
    return {
      success: false,
      message: "Terjadi kesalahan saat terhubung ke server.",
    };
  }
}
