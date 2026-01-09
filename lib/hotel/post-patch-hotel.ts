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

export async function addHotel(payload: {
  name: string;
  en_description: string;
  id_description: string;
  logo: string;
  highlight_image: string;
  reference_image: string[];
  location_map: string;
  location: string;
}) {
  try {
    console.log("Sending hotel/create to BE:", payload);
    const accessToken = await getAccessToken();
    const res = await fetch(`${apiBaseUrl}/api/v1/hotels`, {
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
        error: `Failed to sent hotel/create data. Cause: ${res.status} - ${data.message}`,
      };
    }

    const locale = await getLocale();

    revalidatePath(`/${locale}/home`);
    revalidatePath(`/${locale}/hotel`);
    revalidatePath(`/${locale}/hotel/${data.slug}`);
    revalidatePath(`/${locale}/studio/hotel/${data.slug}`);

    return {
      data,
      success: true,
    };
  } catch (error) {
    console.error("Sent hotel/create Error:", error);
    return {
      success: false,
      message: "Terjadi kesalahan saat terhubung ke server.",
    };
  }
}

export async function updateHotel(
  payload: {
    name?: string;
    en_description?: string;
    id_description?: string;
    logo?: string;
    highlight_image?: string;
    reference_image?: string[];
    location_map?: string;
    location?: string;
  },
  id: string
) {
  try {
    console.log("Sending hotel/update to BE:", payload);
    const accessToken = await getAccessToken();

    const res = await fetch(`${apiBaseUrl}/api/v1/hotels/${id}`, {
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
        error: `Failed to sent hotel/update data. Cause: ${res.status} - ${data.message}`,
      };
    }
    const locale = await getLocale();
    revalidatePath(`/${locale}/home`);
    revalidatePath(`/${locale}/hotel`);
    revalidatePath(`/${locale}/hotel/${data.slug}`);
    revalidatePath(`/${locale}/studio/hotel/${data.slug}`);
    return {
      data,
      success: true,
    };
  } catch (error) {
    console.error("Sent hotel/update Error:", error);
    return {
      success: false,
      message: "Terjadi kesalahan saat terhubung ke server.",
    };
  }
}
