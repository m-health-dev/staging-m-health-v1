"use server";

import { Message } from "@/components/chatbot/ChatStart";
import { error } from "console";
import { getLocale } from "next-intl/server";
import { revalidatePath } from "next/cache";
import { success } from "zod";

const apiBaseUrl =
  process.env.NODE_ENV === "production"
    ? process.env.NEXT_PUBLIC_PROD_BACKEND_URL
    : process.env.NEXT_PUBLIC_DEV_BACKEND_URL;

export async function addMedical(payload: {
  en_title: string;
  id_title: string;
  en_tagline: string;
  id_tagline: string;
  highlight_image: string;
  reference_image: string[];
  duration_by_day: number;
  duration_by_night?: number;
  spesific_gender: string;
  en_medical_package_content: string;
  id_medical_package_content: string;
  included: string[];
  vendor_id: string;
  real_price: number;
  discount_price: number;
  status: string;
}) {
  try {
    console.log("Sending medical/create to BE:", payload);
    const res = await fetch(`${apiBaseUrl}/api/v1/medical`, {
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
        error: `Failed to sent medical/create data. Cause: ${res.status} - ${data.message}`,
      };
    }

    return {
      data,
      success: true,
    };
  } catch (error) {
    console.error("Sent medical/create Error:", error);
    return {
      success: false,
      message: "Terjadi kesalahan saat terhubung ke server.",
    };
  }
}

export async function updateMedical(
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
    en_medical_package_content?: string;
    id_medical_package_content?: string;
    included?: string[];
    vendor_id?: string;
    real_price?: number;
    discount_price?: number;
    status: string;
  },
  id: string
) {
  try {
    console.log("Sending medical/update to BE:", payload);
    const locale = await getLocale();

    const res = await fetch(`${apiBaseUrl}/api/v1/medical/${id}`, {
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
        error: `Failed to sent medical/update data. Cause: ${res.status} - ${data.message}`,
      };
    }

    revalidatePath(`/${locale}/medical/${data.slug}`);

    return {
      data,
      success: true,
    };
  } catch (error) {
    console.error("Sent medical/update Error:", error);
    return {
      success: false,
      message: "Terjadi kesalahan saat terhubung ke server.",
    };
  }
}
