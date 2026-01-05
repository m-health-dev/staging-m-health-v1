"use server";

import { getAccessToken } from "@/app/[locale]/(auth)/actions/auth.actions";
import { createClient } from "@/utils/supabase/server";
import { error } from "console";
import { getLocale } from "next-intl/server";
import { revalidatePath } from "next/cache";
import { success } from "zod";

const apiBaseUrl =
  process.env.NODE_ENV === "production"
    ? process.env.NEXT_PUBLIC_PROD_BACKEND_URL
    : process.env.NEXT_PUBLIC_DEV_BACKEND_URL;

export async function addWellness(payload: {
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
  included: string[];
  vendor_id: string;
  hotel_id?: string;
  real_price: number;
  discount_price: number;
  status: string;
}) {
  try {
    const accessToken = await getAccessToken();

    console.log("Sending wellness/create to BE:", payload);
    const res = await fetch(`${apiBaseUrl}/api/v1/wellness`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (res.status !== 200 && res.status !== 201 && res.status !== 204) {
      return {
        success: false,
        error: `Failed to sent wellness/create data. Cause: ${res.status} - ${data.message}`,
      };
    }

    const locale = await getLocale();
    revalidatePath(`/${locale}/home`);
    revalidatePath(`/${locale}/wellness`);
    revalidatePath(`/${locale}/wellness/${data.slug}`);
    revalidatePath(`/${locale}/studio/wellness/${data.slug}`);

    return {
      data,
      success: true,
    };
  } catch (error) {
    console.error("Sent wellness/create Error:", error);
    return {
      success: false,
      message: "Terjadi kesalahan saat terhubung ke server.",
    };
  }
}

export async function updateWellness(
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
    included?: string[];
    vendor_id?: string;
    hotel_id?: string;
    real_price?: number;
    discount_price?: number;
    status: string;
  },
  id: string
) {
  try {
    console.log("Sending wellness/update to BE:", payload);
    const locale = await getLocale();
    const accessToken = await getAccessToken();

    const res = await fetch(`${apiBaseUrl}/api/v1/wellness/${id}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (res.status !== 200) {
      return {
        success: false,
        error: `Failed to sent wellness/update data. Cause: ${res.status} - ${data.message}`,
      };
    }

    revalidatePath(`/${locale}/home`);
    revalidatePath(`/${locale}/wellness`);
    revalidatePath(`/${locale}/wellness/${data.slug}`);
    revalidatePath(`/${locale}/studio/wellness/${data.slug}`);

    return {
      data,
      success: true,
    };
  } catch (error) {
    console.error("Sent wellness/update Error:", error);
    return {
      success: false,
      message: "Terjadi kesalahan saat terhubung ke server.",
    };
  }
}
