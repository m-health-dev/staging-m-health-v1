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

export async function addMedicalEquipment(payload: {
  en_title: string;
  id_title: string;
  spesific_gender: string;
  highlight_image: string;
  reference_image: string[];
  en_description: string;
  id_description: string;
  vendor_id: string;
  real_price: number;
  discount_price: number;
  status: string;
}) {
  try {
    console.log("Sending equipment/create to BE:", payload);
    const accessToken = await getAccessToken();
    const res = await fetch(`${apiBaseUrl}/api/v1/medical-equipment`, {
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
        error: `Failed to sent equipment/create data. Cause: ${res.status} - ${data.message}`,
      };
    }

    const locale = await getLocale();

    revalidatePath(`/${locale}/equipment`);
    revalidatePath(`/${locale}/equipment/${data.slug}`);
    revalidatePath(`/${locale}/studio/equipment/${data.slug}`);

    return {
      data,
      success: true,
    };
  } catch (error) {
    console.error("Sent equipment/create Error:", error);
    return {
      success: false,
      message: "Terjadi kesalahan saat terhubung ke server.",
    };
  }
}

export async function updateMedicalEquipment(
  payload: {
    en_title?: string;
    id_title?: string;
    spesific_gender?: string;
    highlight_image?: string;
    reference_image?: string[];
    en_description?: string;
    id_description?: string;
    vendor_id?: string;
    real_price?: number;
    discount_price?: number;
    status?: string;
  },
  id: string
) {
  try {
    console.log("Sending equipment/update to BE:", payload);
    const locale = await getLocale();
    const accessToken = await getAccessToken();

    const res = await fetch(`${apiBaseUrl}/api/v1/medical-equipment/${id}`, {
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
        error: `Failed to sent equipment/update data. Cause: ${res.status} - ${data.message}`,
      };
    }

    revalidatePath(`/${locale}/equipment`);
    revalidatePath(`/${locale}/equipment/${data.slug}`);
    revalidatePath(`/${locale}/studio/equipment/${data.slug}`);

    return {
      data,
      success: true,
    };
  } catch (error) {
    console.error("Sent equipment/update Error:", error);
    return {
      success: false,
      message: "Terjadi kesalahan saat terhubung ke server.",
    };
  }
}
