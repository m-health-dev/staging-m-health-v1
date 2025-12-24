"use server";

import { apiSecretKey } from "@/helper/api-secret-key";
import { error } from "console";
import { success } from "zod";
import { meta } from "zod/v4/core";

const apiBaseUrl =
  process.env.NODE_ENV === "production"
    ? process.env.NEXT_PUBLIC_PROD_BACKEND_URL
    : process.env.NEXT_PUBLIC_DEV_BACKEND_URL;

export async function getAllPackages(page: number = 1, per_page: number = 10) {
  try {
    const res = await fetch(
      `${apiBaseUrl}/api/v1/packages?page=${page}&per_page=${per_page}`,
      {
        next: { revalidate: 60 },
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
        error: `Failed to receive packages/read data. Cause : ${json.message}`,
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
    console.error("Receive packages/read Error:", error);
    return {
      success: false,
      message: "Terjadi kesalahan saat terhubung ke server.",
    };
  }
}

export async function getAllPublicPackages(
  page: number = 1,
  per_page: number = 10
) {
  try {
    const res = await fetch(
      `${apiBaseUrl}/api/v1/packages?status=published&page=${page}&per_page=${per_page}`,
      {
        next: { revalidate: 60 },
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
        data: [],
        links: null,
        meta: null,
        error: `Failed to receive packages/read data. Cause : ${json.message}`,
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
    console.error("Receive packages/read Error:", error);
    return {
      success: false,
      message: "Terjadi kesalahan saat terhubung ke server.",
    };
  }
}

export async function getPackageByID(id: string) {
  try {
    const res = await fetch(`${apiBaseUrl}/api/v1/packages/${id}`, {
      method: "GET",
      headers: {
        "X-API-Key": apiSecretKey,
        "Content-Type": "application/json",
      },
    });

    const data = await res.json();

    if (res.status !== 200) {
      return {
        success: false,
        error: `Failed to receive packages/read by ID ${id}. Cause : ${res.status} - ${data.message}`,
      };
    }

    return {
      data: data.data,
      success: true,
    };
  } catch (error) {
    console.error(`Receive packages/id:${id} Error:`, error);
    return {
      success: false,
      message: "Terjadi kesalahan saat terhubung ke server.",
    };
  }
}

export async function getPackageBySlug(slug: string) {
  try {
    const res = await fetch(`${apiBaseUrl}/api/v1/packages/${slug}`, {
      method: "GET",
      headers: {
        "X-API-Key": apiSecretKey,
        "Content-Type": "application/json",
      },
    });

    const data = await res.json();

    if (res.status !== 200) {
      return {
        success: false,
        error: `Failed to receive packages/read by slug ${slug}. Cause : ${res.status} - ${data.message}`,
      };
    }

    return {
      data,
      success: true,
    };
  } catch (error) {
    console.error(`Receive packages/slug:${slug} Error:`, error);
    return {
      success: false,
      message: "Terjadi kesalahan saat terhubung ke server.",
    };
  }
}
