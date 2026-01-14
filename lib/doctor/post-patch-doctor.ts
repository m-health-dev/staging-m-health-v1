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

export async function addDoctor(payload: {
  name: string;
  email: string;
  phone: string;
  license_number: string;
  specialty: string[];
  en_bio: string;
  id_bio: string;
  photo_url: string;
  is_available: boolean;
  status: string;
}) {
  try {
    console.log("Sending doctor/create to BE:", payload);
    const accessToken = await getAccessToken();
    const res = await fetch(`${apiBaseUrl}/api/v1/doctors`, {
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
        error: `Failed to sent doctor/create data. Cause: ${res.status} - ${data.message}`,
      };
    }

    const locale = await getLocale();

    revalidatePath(`/${locale}/doctor`);
    revalidatePath(`/${locale}/doctor/${data.slug}`);
    revalidatePath(`/${locale}/studio/doctors/${data.slug}`);

    return {
      data,
      success: true,
    };
  } catch (error) {
    console.error("Sent doctor/create Error:", error);
    return {
      success: false,
      message: "Terjadi kesalahan saat terhubung ke server.",
    };
  }
}

export async function updateDoctor(
  payload: {
    name: string;
    email: string;
    phone: string;
    license_number: string;
    specialty: string[];
    en_bio: string;
    id_bio: string;
    photo_url: string;
    is_available: boolean;
    status: string;
  },
  id: string
) {
  try {
    console.log("Sending doctor/update to BE:", payload);
    const locale = await getLocale();
    const accessToken = await getAccessToken();

    const res = await fetch(`${apiBaseUrl}/api/v1/doctors/${id}`, {
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
        error: `Failed to sent doctor/update data. Cause: ${res.status} - ${data.message}`,
      };
    }

    revalidatePath(`/${locale}/doctor`);
    revalidatePath(`/${locale}/doctor/${data.slug}`);
    revalidatePath(`/${locale}/studio/doctors/${data.slug}`);

    return {
      data,
      success: true,
    };
  } catch (error) {
    console.error("Sent doctor/update Error:", error);
    return {
      success: false,
      message: "Terjadi kesalahan saat terhubung ke server.",
    };
  }
}

export async function assignDoctor(payload: { doctor_id: string }, id: string) {
  try {
    console.log("Sending consultation/assign-doctor to BE:", payload.doctor_id);
    const locale = await getLocale();
    const accessToken = await getAccessToken();

    const res = await fetch(
      `${apiBaseUrl}/api/v1/consultations/${id}/assign-doctor`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    );

    const raw = await res.text();
    let data: any = null;
    try {
      data = raw ? JSON.parse(raw) : null;
    } catch {
      data = null;
    }

    if (!res.ok) {
      const contentType = res.headers.get("content-type") || "";
      const snippet = raw?.slice(0, 200);
      return {
        success: false,
        error: `Failed to sent consultation/assign-doctor data. Cause: ${
          res.status
        } - ${
          data?.message ??
          `Non-JSON response (${
            contentType || "unknown content-type"
          }): ${snippet}`
        }`,
      };
    }

    if (!data) {
      const contentType = res.headers.get("content-type") || "";
      return {
        success: false,
        error: `Failed to parse consultation/assign-doctor response as JSON. Received: ${
          contentType || "unknown content-type"
        }`,
      };
    }

    if (res.status !== 200) {
      return {
        success: false,
        error: `Failed to sent consultation/assign-doctor data. Cause: ${res.status} - ${data?.message}`,
      };
    }

    revalidatePath(`/${locale}/dashboard/consult/${id}`);
    revalidatePath(`/${locale}/studio/consult/assign-doctor/${id}`);

    return {
      data,
      success: true,
    };
  } catch (error) {
    console.error("Sent consultation/assign-doctor Error:", error);
    return {
      success: false,
      error: true,
      message: "Terjadi kesalahan saat terhubung ke server.",
    };
  }
}
