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

export async function addArticleAuthor(payload: {
  name: string;
  jobdesc: string;
  profile_image: string;
}) {
  try {
    console.log("Sending article-author/create to BE:", payload);
    const accessToken = await getAccessToken();

    const res = await fetch(`${apiBaseUrl}/api/v1/authors`, {
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
        error: `Failed to sent article-author/create data. Cause: ${res.status} - ${data.message}`,
      };
    }

    const locale = await getLocale();
    revalidatePath(`/${locale}/home`);
    revalidatePath(`/${locale}/article`);
    revalidatePath(`/${locale}/studio/article/author`);
    revalidatePath(`/${locale}/article/${data.slug}`);
    revalidatePath(`/${locale}/studio/article/author/${data.slug}`);

    return {
      data,
      success: true,
    };
  } catch (error) {
    console.error("Sent article-author/create Error:", error);
    return {
      success: false,
      message: "Terjadi kesalahan saat terhubung ke server.",
    };
  }
}

export async function updateArticleAuthor(
  payload: {
    name?: string;
    jobdesc?: string;
    profile_image?: string;
  },
  id: string
) {
  try {
    console.log("Sending article-author/update to BE:", payload);
    const accessToken = await getAccessToken();

    const res = await fetch(`${apiBaseUrl}/api/v1/authors/${id}`, {
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
        error: `Failed to sent article-author/update data. Cause: ${res.status} - ${data.message}`,
      };
    }

    const locale = await getLocale();
    revalidatePath(`/${locale}/home`);
    revalidatePath(`/${locale}/article`);
    revalidatePath(`/${locale}/studio/article/author`);
    revalidatePath(`/${locale}/article/${data.slug}`);
    revalidatePath(`/${locale}/studio/article/author/${data.slug}`);

    return {
      data,
      success: true,
    };
  } catch (error) {
    console.error("Sent article-author/update Error:", error);
    return {
      success: false,
      message: "Terjadi kesalahan saat terhubung ke server.",
    };
  }
}
