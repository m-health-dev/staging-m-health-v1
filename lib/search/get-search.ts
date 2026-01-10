"use server";

import { getAccessToken } from "@/app/[locale]/(auth)/actions/auth.actions";
import { apiSecretKey } from "@/helper/api-secret-key";
import { meta } from "zod/v4/core";

const apiBaseUrl =
  process.env.NODE_ENV === "production"
    ? process.env.NEXT_PUBLIC_PROD_BACKEND_URL
    : process.env.NEXT_PUBLIC_DEV_BACKEND_URL;

export type typeOftarget = [
  "articles",
  "events",
  "hotels",
  "medical",
  "medical-equipment",
  "packages",
  "vendors",
  "wellness"
];

export async function getAllSearchResultPublishedByType(
  query: string,
  type: typeOftarget
) {
  try {
    const res = await fetch(
      `${apiBaseUrl}/api/v1/search?q=${query}&type=${type}&status=published`,
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
        summary: null,
        results: null,
        meta: null,
        total: 0,
        error: `Failed to receive search results by type. Cause : ${json.message}`,
      };
    }

    // console.log(json.links);
    return {
      summary: json.data.summary,
      results: json.data.results,
      meta: json.meta,
      total: json.data.summary.total_results,
      success: true,
    };
  } catch (error) {
    console.error("Receive search results by type Error:", error);
    return {
      success: false,
      summary: null,
      results: null,
      meta: null,
      total: 0,
      message: "Terjadi kesalahan saat terhubung ke server.",
    };
  }
}

export async function getAllSearchResultPublished(
  query: string,
  target?: string
) {
  try {
    const res = await fetch(
      target
        ? `${apiBaseUrl}/api/v1/search?q=${query}&type=${target}&status=published`
        : `${apiBaseUrl}/api/v1/search?q=${query}&status=published`,
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
        summary: null,
        results: null,
        meta: null,
        total: 0,
        error: `Failed to receive search results published. Cause : ${json.message}`,
      };
    }

    // console.log(json.links);
    return {
      summary: json.data.summary,
      results: json.data.results,
      meta: json.meta,
      total: json.data.summary.total_results,
      success: true,
    };
  } catch (error) {
    console.error("Receive search results published Error:", error);
    return {
      success: false,
      summary: null,
      results: null,
      meta: null,
      total: 0,
      message: "Terjadi kesalahan saat terhubung ke server.",
    };
  }
}

export async function getAllSearchResult(query: string, type: typeOftarget) {
  const accessToken = await getAccessToken();
  try {
    const res = await fetch(
      `${apiBaseUrl}/api/v1/search?q=${query}&type=${type}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "X-API-Key": apiSecretKey,
          "Content-Type": "application/json",
        },
      }
    );

    const json = await res.json();

    if (res.status !== 200) {
      return {
        success: false,
        summary: null,
        results: null,
        meta: null,
        total: 0,
        error: `Failed to receive search results by type in all status. Cause : ${json.message}`,
      };
    }

    // console.log(json.links);
    return {
      summary: json.data.summary,
      results: json.data.results,
      meta: json.meta,
      total: json.data.summary.total_results,
      success: true,
    };
  } catch (error) {
    console.error("Receive search results by type in all status Error:", error);
    return {
      success: false,
      summary: null,
      results: null,
      meta: null,
      total: 0,
      message: "Terjadi kesalahan saat terhubung ke server.",
    };
  }
}
