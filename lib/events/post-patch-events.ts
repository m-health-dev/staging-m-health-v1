"use server";

import { getAccessToken } from "@/app/[locale]/(auth)/actions/auth.actions";
import { apiBaseUrl } from "@/helper/baseUrl";
import { createClient } from "@/utils/supabase/server";
import { error } from "console";
import { getLocale } from "next-intl/server";
import { revalidatePath } from "next/cache";
import { success } from "zod";

export async function addEvent(payload: {
  en_title: string;
  id_title: string;
  en_description: string;
  id_description: string;
  highlight_image: string;
  reference_image: string[];
  organized_image: string;
  organized_by: string;
  start_date: Date;
  end_date: Date;
  location_name: string;
  location_map: string;
  registration_url?: string;
  status: string;
}) {
  try {
    const accessToken = await getAccessToken();

    const res = await fetch(`${apiBaseUrl}/api/v1/events`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    console.log("Sending Event/create to BE:", { res, payload, accessToken });

    const data = await res.json();

    if (res.status !== 200 && res.status !== 201 && res.status !== 204) {
      return {
        success: false,
        error: `Failed to sent Event/create data. Cause: ${res.status} - ${data.message}`,
      };
    }

    return {
      data,
      success: true,
    };
  } catch (error) {
    console.error("Sent Event/create Error:", error);
    return {
      success: false,
      message: "Terjadi kesalahan saat terhubung ke server.",
    };
  }
}

export async function updateEvent(
  payload: {
    en_title?: string;
    id_title?: string;
    en_description?: string;
    id_description?: string;
    highlight_image?: string;
    reference_image?: string[];
    organized_image?: string;
    organized_by?: string;
    start_date?: Date;
    end_date?: Date;
    location_name?: string;
    location_map?: string;
    registration_url?: string;
    status?: string;
  },
  id: string
) {
  try {
    console.log("Sending Event/update to BE:", payload);
    const locale = await getLocale();
    const accessToken = await getAccessToken();

    const res = await fetch(`${apiBaseUrl}/api/v1/events/${id}`, {
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
        error: `Failed to sent Event/update data. Cause: ${res.status} - ${data.message}`,
      };
    }

    revalidatePath(`/${locale}/event/${data.slug}`);

    return {
      data,
      success: true,
    };
  } catch (error) {
    console.error("Sent Event/update Error:", error);
    return {
      success: false,
      message: "Terjadi kesalahan saat terhubung ke server.",
    };
  }
}
