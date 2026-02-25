"use server";

import { apiSecretKey } from "@/helper/api-secret-key";
import { createClientAdmin } from "@/utils/supabase/admin";

const apiBaseUrl =
  process.env.NODE_ENV === "production"
    ? process.env.NEXT_PUBLIC_PROD_BACKEND_URL
    : process.env.NEXT_PUBLIC_DEV_BACKEND_URL;

export async function getAllHero(page: number = 1, per_page: number = 10) {
  try {
    const res = await fetch(
      `${apiBaseUrl}/api/v1/hero-sections?page=${page}&per_page=${per_page}`,
      {
        method: "GET",
        headers: {
          "X-API-Key": apiSecretKey,
          "Content-Type": "application/json",
        },
      }
    );

    const json = await res.json();

    if (res.status !== 200) {
      return {
        success: false,
        error: `Failed to receive hero/read data. Cause : ${json.message}`,
      };
    }

    // console.log(json.links);
    return {
      data: json.data,
      links: json.links,
      meta: json.meta,
      total: json.meta.total,
      success: true,
    };
  } catch (error) {
    console.error("Receive hero/read Error:", error);
    return {
      success: false,
      message: "Terjadi kesalahan saat terhubung ke server.",
    };
  }
}

export async function getAllActiveHero() {
  try {
    const res = await fetch(
      `${apiBaseUrl}/api/v1/hero-sections?active_only=true`,
      {
        method: "GET",
        headers: {
          "X-API-Key": apiSecretKey,
          "Content-Type": "application/json",
        },
      }
    );

    const json = await res.json();

    if (res.status !== 200) {
      return {
        success: false,
        error: `Failed to receive hero/read by active data. Cause : ${json.message}`,
      };
    }

    // console.log(json.links);
    return {
      data: json.data,
      links: json.links,
      meta: json.meta,
      success: true,
    };
  } catch (error) {
    console.error("Receive hero/read by active Error:", error);
    return {
      success: false,
      message: "Terjadi kesalahan saat terhubung ke server.",
    };
  }
}

export async function getHeroByID(id: string) {
  const supabase = await createClientAdmin();
  try {
    const { data: HeroData, error: errorHeroData } = await supabase
      .from("hero_section")
      .select("*")
      .eq("id", id)
      .single();

    if (errorHeroData) {
      return {
        success: false,
        error: `Failed to receive hero/read by id data. Cause : ${errorHeroData.message}`,
      };
    }

    // console.log(json.links);
    return {
      data: HeroData,
      success: true,
    };
  } catch (error) {
    console.error("Receive hero/read by id Error:", error);
    return {
      success: false,
      message: "Terjadi kesalahan saat terhubung ke server.",
    };
  }
}
