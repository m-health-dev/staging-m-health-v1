"use server";

import { apiSecretKey } from "@/helper/api-secret-key";
import { error } from "console";
import { success } from "zod";

const apiBaseUrl =
  process.env.NODE_ENV === "production"
    ? process.env.NEXT_PUBLIC_PROD_BACKEND_URL
    : process.env.NEXT_PUBLIC_DEV_BACKEND_URL;

export async function getAllPublicMedicalEquipment(
  page: number = 1,
  per_page: number = 10
) {
  try {
    const res = await fetch(
      `${apiBaseUrl}/api/v1/medical-equipment?status=published&page=${page}&per_page=${per_page}`,
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
        error: `Failed to receive equipment/read data. Cause : ${json.message}`,
      };
    }

    // console.log(json.links);
    return {
      data: json.data,
      links: json.links,
      meta: json.meta,
      total: json.total,
      success: true,
    };
  } catch (error) {
    console.error("Receive equipment/read Error:", error);
    return {
      success: false,
      message: "Terjadi kesalahan saat terhubung ke server.",
    };
  }
}

export async function getAllMedicalEquipment(
  page: number = 1,
  per_page: number = 10
) {
  try {
    const res = await fetch(
      `${apiBaseUrl}/api/v1/medical-equipment?page=${page}&per_page=${per_page}`,
      {
        cache: "no-store",
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
        error: `Failed to receive equipment/read data. Cause : ${json.message}`,
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
    console.error("Receive equipment/read Error:", error);
    return {
      success: false,
      message: "Terjadi kesalahan saat terhubung ke server.",
    };
  }
}

export async function getMedicalEquipmentByID(id: string) {
  try {
    const res = await fetch(`${apiBaseUrl}/api/v1/medical-equipment/${id}`, {
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
        error: `Failed to receive equipment/read by ID ${id}. Cause : ${res.status} - ${data.message}`,
      };
    }

    console.log(data);

    return {
      data,
      success: true,
    };
  } catch (error) {
    console.error(`Receive equipment/id:${id} Error:`, error);
    return {
      success: false,
      message: "Terjadi kesalahan saat terhubung ke server.",
    };
  }
}

export async function getMedicalEquipmentBySlug(slug: string) {
  try {
    const res = await fetch(`${apiBaseUrl}/api/v1/medical-equipment/${slug}`, {
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
        error: `Failed to receive equipment/read by slug ${slug}. Cause : ${res.status} - ${data.message}`,
      };
    }

    return {
      data,
      success: true,
    };
  } catch (error) {
    console.error(`Receive equipment/slug:${slug} Error:`, error);
    return {
      success: false,
      message: "Terjadi kesalahan saat terhubung ke server.",
    };
  }
}
