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

export async function addInsurance(payload: {
  name: string;
  en_description: string;
  id_description: string;
  category: string[];
  specialist: string[];
  highlight_image: string;
  logo: string;
  agent_name: string;
  agent_number: string;
  agent_photo_url: string;
}) {
  try {
    console.log("Sending insurance/create to BE:", payload);
    const accessToken = await getAccessToken();

    const res = await fetch(`${apiBaseUrl}/api/v1/insurance`, {
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
        error: `Failed to sent insurance/create data. Cause: ${res.status} - ${data.message}`,
      };
    }

    const locale = await getLocale();

    revalidatePath(`/${locale}/home`);
    revalidatePath(`/${locale}/insurance`);
    revalidatePath(`/${locale}/insurance/${data.slug}`);
    revalidatePath(`/${locale}/studio/insurance`);
    revalidatePath(`/${locale}/studio/insurance/${data.slug}`);

    return {
      data,
      success: true,
    };
  } catch (error) {
    console.error("Sent insurance/create Error:", error);
    return {
      success: false,
      message: "Terjadi kesalahan saat terhubung ke server.",
    };
  }
}

export async function updateInsurance(
  payload: {
    name?: string;
    en_description?: string;
    id_description?: string;
    category?: string[];
    specialist?: string[];
    highlight_image?: string;
    logo?: string;
    agent_name?: string;
    agent_number?: string;
    agent_photo_url?: string;
  },
  id: string,
) {
  try {
    console.log("Sending insurance/update to BE:", payload);
    const accessToken = await getAccessToken();

    const res = await fetch(`${apiBaseUrl}/api/v1/insurance/${id}`, {
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
        error: `Failed to sent insurance/update data. Cause: ${res.status} - ${data.message}`,
      };
    }
    const locale = await getLocale();

    revalidatePath(`/${locale}/home`);
    revalidatePath(`/${locale}/insurance`);
    revalidatePath(`/${locale}/insurance/${data.slug}`);
    revalidatePath(`/${locale}/studio/insurance/${data.slug}`);
    revalidatePath(`/${locale}/studio/insurance`);

    return {
      data,
      success: true,
    };
  } catch (error) {
    console.error("Sent insurance/update Error:", error);
    return {
      success: false,
      message: "Terjadi kesalahan saat terhubung ke server.",
    };
  }
}
