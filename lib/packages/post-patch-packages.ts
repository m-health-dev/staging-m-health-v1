"use server";

import { error } from "console";
import { getLocale } from "next-intl/server";
import { revalidatePath } from "next/cache";
import { success } from "zod";

const apiBaseUrl =
  process.env.NODE_ENV === "production"
    ? process.env.NEXT_PUBLIC_PROD_BACKEND_URL
    : process.env.NEXT_PUBLIC_DEV_BACKEND_URL;

export async function addPackage(payload: {
  en_title: string;
  id_title: string;
  en_tagline: string;
  id_tagline: string;
  highlight_image: string;
  reference_image: string[];
  duration_by_day: number;
  duration_by_night?: number;
  spesific_gender: string;
  en_wellness_package_content: string;
  id_wellness_package_content: string;
  en_medical_package_content: string;
  id_medical_package_content: string;
  en_detail: string;
  id_detail: string;
  included: string[];
  vendor_id: string;
  real_price: number;
  discount_price: number;
  status: string;
}) {
  try {
    console.log("Sending package/create to BE:", payload);
    const res = await fetch(`${apiBaseUrl}/api/v1/packages`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (res.status !== 200 && res.status !== 201 && res.status !== 204) {
      return {
        success: false,
        error: `Failed to sent package/create data. Cause: ${res.status} - ${data.message}`,
      };
    }

    return {
      data,
      success: true,
    };
  } catch (error) {
    console.error("Sent package/create Error:", error);
    return {
      success: false,
      message: "Terjadi kesalahan saat terhubung ke server.",
    };
  }
}

export async function updatePackage(
  payload: {
    en_title: string;
    id_title: string;
    en_tagline?: string;
    id_tagline?: string;
    highlight_image?: string;
    reference_image?: string[];
    duration_by_day?: number;
    duration_by_night?: number;
    spesific_gender?: string;
    en_wellness_package_content?: string;
    id_wellness_package_content?: string;
    en_medical_package_content?: string;
    id_medical_package_content?: string;
    en_detail?: string;
    id_detail?: string;
    included?: string[];
    vendor_id?: string;
    real_price?: number;
    discount_price?: number;
    status: string;
  },
  id: string
) {
  try {
    console.log("Sending package/update to BE:", payload);
    const locale = await getLocale();

    const res = await fetch(`${apiBaseUrl}/api/v1/packages/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (res.status !== 200) {
      return {
        success: false,
        error: `Failed to sent package/update data. Cause: ${res.status} - ${data.message}`,
      };
    }

    revalidatePath(`/${locale}/package/${data.slug}`);

    return {
      data,
      success: true,
    };
  } catch (error) {
    console.error("Sent package/update Error:", error);
    return {
      success: false,
      message: "Terjadi kesalahan saat terhubung ke server.",
    };
  }
}
