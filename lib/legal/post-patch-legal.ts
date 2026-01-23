"use server";

import { getAccessToken } from "@/app/[locale]/(auth)/actions/auth.actions";

const apiBaseUrl =
  process.env.NODE_ENV === "production"
    ? process.env.NEXT_PUBLIC_PROD_BACKEND_URL
    : process.env.NEXT_PUBLIC_DEV_BACKEND_URL;

export async function postTermsOfService(payload: {
  en_title: string;
  id_title: string;
  en_content: string;
  id_content: string;
}) {
  try {
    const accessToken = await getAccessToken();
    if (!accessToken) {
      return {
        success: false,
        error: "Missing access token.",
      };
    }

    const res = await fetch(`${apiBaseUrl}/api/v1/admin/terms`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const json = await res.json();

    if (res.status !== 201) {
      return {
        success: false,
        error: `Failed to receive terms/create data. Cause : ${json.message}`,
      };
    }

    // console.log(json.links);
    return {
      data: json.data,
      success: true,
    };
  } catch (error) {
    console.error("Receive terms/create Error:", error);
    return {
      success: false,
      message: "Terjadi kesalahan saat terhubung ke server.",
    };
  }
}

export async function postPrivacyPolicy(payload: {
  en_title: string;
  id_title: string;
  en_content: string;
  id_content: string;
}) {
  try {
    console.log("postPrivacyPolicy payload:", payload);
    const accessToken = await getAccessToken();
    if (!accessToken) {
      return {
        success: false,
        error: "Missing access token.",
      };
    }

    const res = await fetch(`${apiBaseUrl}/api/v1/admin/privacy-policy`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    console.log({ res });

    const json = await res.json();

    if (res.status !== 201) {
      return {
        success: false,
        error: `Failed to receive privacy-policy/create data. Cause : ${json.message}`,
      };
    }

    // console.log(json.links);
    return {
      data: json,
      success: true,
    };
  } catch (error) {
    console.error("Receive privacy-policy/create Error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
      message: "Terjadi kesalahan saat terhubung ke server.",
    };
  }
}
