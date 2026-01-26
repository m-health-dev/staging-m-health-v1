"use server";

import { getAccessToken } from "@/app/[locale]/(auth)/actions/auth.actions";
import { apiSecretKey } from "@/helper/api-secret-key";
import { createClient } from "@/utils/supabase/client";
import { link } from "node:fs";
import { success } from "zod";
import { meta } from "zod/v4/core";

const apiBaseUrl =
  process.env.NODE_ENV === "production"
    ? process.env.NEXT_PUBLIC_PROD_BACKEND_URL
    : process.env.NEXT_PUBLIC_DEV_BACKEND_URL;

export async function getAITokenUsageStats() {
  const accessToken = await getAccessToken();
  try {
    const res = await fetch(`${apiBaseUrl}/api/v1/ai-token-usage/stats`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "X-API-Key": apiSecretKey,
        "Content-Type": "application/json",
      },
    });

    const json = await res.json();

    if (res.status !== 200) {
      return {
        success: false,
        error: `Failed to receive ai-token-usage/stats data. Cause : ${json.message}`,
      };
    }

    // console.log(json.links);
    return {
      totals: {
        total_requests: json.totals.total_requests,
        total_prompt_tokens: json.totals.total_prompt_tokens,
        total_candidates_tokens: json.totals.total_candidates_tokens,
        total_all_tokens: json.totals.total_all_tokens,
        total_thoughts_tokens: json.totals.total_thoughts_tokens,
      },
      by_model: json.by_model,
      daily: json.daily,
      success: true,
    };
  } catch (error) {
    console.error("Receive ai-token-usage/stats Error:", error);
    return {
      success: false,
      message: "Terjadi kesalahan saat terhubung ke server.",
    };
  }
}
