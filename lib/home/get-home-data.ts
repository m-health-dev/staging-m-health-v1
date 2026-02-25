"use server";

import { apiSecretKey } from "@/helper/api-secret-key";
import { fetchWithTimeout } from "@/helper/fetchWithTimeout";

const apiBaseUrl =
  process.env.NODE_ENV === "production"
    ? process.env.NEXT_PUBLIC_PROD_BACKEND_URL
    : process.env.NEXT_PUBLIC_DEV_BACKEND_URL;

export async function getAllHomeData() {
  try {
    const res = await fetchWithTimeout(`${apiBaseUrl}/api/v1/home`, {
      method: "GET",
      headers: {
        "X-API-Key": apiSecretKey,
        "Content-Type": "application/json",
      },
    });

    const json = await res.json();

    if (res.status !== 200 || !json.success) {
      return {
        success: false,
        error: `Failed to receive home-data. Cause : ${json.message}`,
      };
    }

    // console.log(json.links);
    return {
      hero: json.data.banner,
      packages: json.data.packages,
      wellness: json.data.wellness,
      medical: json.data.medical,
      events: json.data.events,
      articles: json.data.articles,
      success: true,
    };
  } catch (error) {
    console.error("Receive home-data Error:", error);
    return {
      success: false,
      message: "Terjadi kesalahan saat terhubung ke server.",
    };
  }
}
