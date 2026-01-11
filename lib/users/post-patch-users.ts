"use server";

import { getAccessToken } from "@/app/[locale]/(auth)/actions/auth.actions";
import { createClientAdmin } from "@/utils/supabase/admin";

export type DomicilePayload = {
  city?: string;
  district?: string;
  address?: string;
  postal_code?: number | string;
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

export async function patchAccountByAdmin(
  payload: {
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
  },
  { id }: { id: string }
) {
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

    console.log("Sending admin account/patch to BE:", normalized);

    const supabase = await createClientAdmin();

    const { data: AdminUserUpdate, error: AdminUserUpdateError } =
      await supabase
        .from("accounts")
        .update(normalized)
        .eq("id", id)
        .select()
        .single();

    if (AdminUserUpdateError) {
      return {
        success: false,
        error: {
          id: `Gagal mengirim data pembaruan akun. Penyebab: ${AdminUserUpdateError.message}`,
          en: `Failed to sent account/patch data. Cause: ${AdminUserUpdateError.message}`,
        },
      };
    }

    return {
      data: AdminUserUpdate,
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
