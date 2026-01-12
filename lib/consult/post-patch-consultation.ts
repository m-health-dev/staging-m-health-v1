"use server";

import { getAccessToken } from "@/app/[locale]/(auth)/actions/auth.actions";
import { createClient } from "@/utils/supabase/server";
import { error } from "console";
import { success } from "zod";
import { patchAccount } from "../users/post-patch-users";
import { toUtcMidnightFromLocalDate } from "@/helper/toUTCMidnight";

const apiBaseUrl =
  process.env.NODE_ENV === "production"
    ? process.env.NEXT_PUBLIC_PROD_BACKEND_URL
    : process.env.NEXT_PUBLIC_DEV_BACKEND_URL;

export async function createConsultation(payload: {
  fullname: string;
  complaint?: string;
  scheduled_datetime: Date;
  date_of_birth: Date;
  height: number;
  weight: number;
  gender: string;
  email: string;
  phone_number: string;
  reference_image?: string[];
  location: {
    city: string;
    district: string;
    address: string;
    postal_code: string;
  };
  chat_session: string;
}) {
  try {
    console.log("Sending consultation/create to BE:", payload);
    const accessToken = await getAccessToken();

    const res = await fetch(`${apiBaseUrl}/api/v1/consultations`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    await patchAccount({
      fullname: payload.fullname,
      phone: payload.phone_number,
      gender: payload.gender,
      height: payload.height,
      weight: payload.weight,
      birthdate: toUtcMidnightFromLocalDate(payload.date_of_birth),
      domicile: {
        city: payload.location.city?.trim() || "",
        district: payload.location.district?.trim() || "",
        address: payload.location.address?.trim() || "",
        postal_code: payload.location.postal_code?.trim() || "",
      },
    });

    const data = await res.json();

    if (res.status !== 200 && res.status !== 201 && res.status !== 204) {
      return {
        success: false,
        error: `Failed to sent consultation/create data. Cause: ${res.status} - ${data.message}`,
      };
    }

    return {
      data: data.consultation,
      success: true,
    };
  } catch (error) {
    console.error("Sent consultation/create Error:", error);
    return {
      success: false,
      message: "Terjadi kesalahan saat terhubung ke server.",
    };
  }
}

export async function updateConsultation(
  payload: {
    fullname?: string;
    complaint?: string;
    scheduled_datetime?: string;
    date_of_birth?: string;
    height?: number;
    weight?: number;
    gender?: string;
    email?: string;
    phone_number?: string;
    reference_image?: string[];
    location: {
      city?: string;
      district?: string;
      address?: string;
      postal_code?: string;
    };
    chat_session?: string;
  },
  id: string
) {
  try {
    console.log("Sending consultation/update to BE:", payload);
    const accessToken = await getAccessToken();

    const res = await fetch(`${apiBaseUrl}/api/v1/consultations/${id}`, {
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
        error: `Failed to sent consultation/update data. Cause: ${res.status} - ${data.message}`,
      };
    }

    return {
      data,
      success: true,
    };
  } catch (error) {
    console.error("Sent consultation/update Error:", error);
    return {
      success: false,
      message: "Terjadi kesalahan saat terhubung ke server.",
    };
  }
}
