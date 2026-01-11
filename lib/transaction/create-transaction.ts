"use server";

import { getAccessToken } from "@/app/[locale]/(auth)/actions/auth.actions";
import { apiSecretKey } from "@/helper/api-secret-key";
import { createClient } from "@/utils/supabase/server";
import { error } from "console";
import { getLocale } from "next-intl/server";
import { revalidatePath } from "next/cache";
import { success } from "zod";

const apiBaseUrl =
  process.env.NODE_ENV === "production"
    ? process.env.NEXT_PUBLIC_PROD_BACKEND_URL
    : process.env.NEXT_PUBLIC_DEV_BACKEND_URL;

export async function createPostTransaction(payload: {
  order_id: string;
  user_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address: string;
  locale: string;
  price: string;
  product_data: {
    type: string;
    id: string;
  };
}) {
  try {
    console.log("Sending transaction/create to BE:", payload);
    const accessToken = await getAccessToken();

    const res = await fetch(`${apiBaseUrl}/api/v1/payments/snap`, {
      method: "POST",
      headers: {
        "X-Api-Key": `${apiSecretKey}`,
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (
      res.status !== 200 &&
      res.status !== 201 &&
      res.status !== 204 &&
      res.status !== 308
    ) {
      return {
        success: false,
        error: `Failed to sent transaction/create data. Cause: ${res.status} - ${data.message}`,
      };
    }

    const locale = await getLocale();

    // revalidatePath(`/${locale}/dashboard`);
    // revalidatePath(`/${locale}/vendor`);
    // revalidatePath(`/${locale}/vendor/${data.slug}`);
    // revalidatePath(`/${locale}/studio/vendor/${data.slug}`);

    return {
      data,
      success: true,
    };
  } catch (error) {
    console.error("Sent transaction/create Error:", error);
    return {
      success: false,
      message: "Terjadi kesalahan saat terhubung ke server.",
    };
  }
}
