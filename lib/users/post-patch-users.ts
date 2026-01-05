"use server";

import { getAccessToken } from "@/app/[locale]/(auth)/actions/auth.actions";

export type DomicilePayload = {
  city?: string;
  district?: string;
  address?: string;
};

const apiBaseUrl =
  process.env.NODE_ENV === "production"
    ? process.env.NEXT_PUBLIC_PROD_BACKEND_URL
    : process.env.NEXT_PUBLIC_DEV_BACKEND_URL;

export async function patchAccount(payload: {
  fullname?: string;
  email?: string;
  phone?: string | number;
  phone_number?: string;
  gender?: string;
  domicile?: DomicilePayload;
  height?: number;
  weight?: number;
  avatar_url?: string;
  birthdate?: Date;
}) {
  try {
    const normalized = {
      email: payload.email,
      fullname: payload.fullname,
      phone: payload.phone ?? payload.phone_number,
      gender: payload.gender,
      domicile: payload.domicile,
      height: payload.height,
      weight: payload.weight,
      avatar_url: payload.avatar_url,
      birthdate: payload.birthdate,
    };

    console.log("Sending account/patch to BE:", normalized);
    const accessToken = await getAccessToken();

    const res = await fetch(`${apiBaseUrl}/api/v1/me`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(normalized),
    });

    const data = await res.json();

    if (res.status !== 200 && res.status !== 201 && res.status !== 204) {
      return {
        success: false,
        error: {
          id: `Gagal mengirim data pembaruan akun. Penyebab: ${res.status} - ${data.message}`,
          en: `Failed to sent account/patch data. Cause: ${res.status} - ${data.message}`,
        },
      };
    }

    return {
      data,
      success: true,
      message: {
        id: "Akun berhasil diperbarui.",
        en: "Account updated successfully.",
      },
    };
  } catch (error) {
    console.error("Sent account/patch Error:", error);
    return {
      success: false,
      message: {
        id: "Terjadi kesalahan saat terhubung ke server.",
        en: "An error occurred while connecting to the server.",
      },
    };
  }
}

export async function updateVendor(
  payload: {
    name?: string;
    en_description?: string;
    id_description?: string;
    category?: string;
    specialist?: string[];
    logo?: string;
    highlight_image?: string;
    reference_image?: string[];
    location_map?: string;
  },
  id: string
) {
  try {
    console.log("Sending vendor/update to BE:", payload);
    const accessToken = await getAccessToken();

    const res = await fetch(`${apiBaseUrl}/api/v1/vendors/${id}`, {
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
        error: `Failed to sent vendor/update data. Cause: ${res.status} - ${data.message}`,
      };
    }

    return {
      data,
      success: true,
    };
  } catch (error) {
    console.error("Sent vendor/update Error:", error);
    return {
      success: false,
      message: "Terjadi kesalahan saat terhubung ke server.",
    };
  }
}
