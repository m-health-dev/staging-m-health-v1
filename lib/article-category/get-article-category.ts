"use server";

import { apiSecretKey } from "@/helper/api-secret-key";
import { error } from "console";
import { success } from "zod";

const apiBaseUrl =
  process.env.NODE_ENV === "production"
    ? process.env.NEXT_PUBLIC_PROD_BACKEND_URL
    : process.env.NEXT_PUBLIC_DEV_BACKEND_URL;

export async function getAllArticleCategoryWithoutPagination() {
  try {
    const res = await fetch(
      `${apiBaseUrl}/api/v1/article-categories?per_page=all`,
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
        error: `Failed to receive ALL article-category data. Cause : ${json.message}`,
      };
    }

    console.log({ json });
    return {
      data: json.data,
      success: true,
    };
  } catch (error) {
    console.error("Receive ALL article-category/read Error:", error);
    return {
      success: false,
      message: "Terjadi kesalahan saat terhubung ke server.",
    };
  }
}

export async function getAllArticleCategory(
  page: number = 1,
  per_page: number = 10
) {
  try {
    const res = await fetch(
      `${apiBaseUrl}/api/v1/article-categories?page=${page}&per_page=${per_page}`,
      {
        cache: "no-store",
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
        error: `Failed to receive article-category data. Cause : ${json.message}`,
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
    console.error("Receive article-category/read Error:", error);
    return {
      success: false,
      message: "Terjadi kesalahan saat terhubung ke server.",
    };
  }
}

export async function getArticleCategoryByID(id: string) {
  try {
    const res = await fetch(`${apiBaseUrl}/api/v1/article-categories/${id}`, {
      method: "GET",
      headers: {
        "X-API-Key": apiSecretKey,
        "Content-Type": "application/json",
      },
    });

    const json = await res.json();
    // console.log({ json });

    if (res.status !== 200) {
      return {
        success: false,
        error: `Failed to receive article-category by ID ${id}. Cause : ${res.status} - ${json.message}`,
      };
    }

    return {
      data: json.data,
      success: true,
    };
  } catch (error) {
    console.error(`Receive article-category/id:${id} Error:`, error);
    return {
      success: false,
      message: "Terjadi kesalahan saat terhubung ke server.",
    };
  }
}

export async function getArticleCategoryBySlug(slug: string) {
  try {
    const res = await fetch(`${apiBaseUrl}/api/v1/article-categories/${slug}`, {
      method: "GET",
      headers: {
        "X-API-Key": apiSecretKey,
        "Content-Type": "application/json",
      },
    });

    const data = await res.json();

    if (res.status !== 200) {
      return {
        success: false,
        error: `Failed to receive article-category by slug ${slug}. Cause : ${res.status} - ${data.message}`,
      };
    }

    return {
      data,
      success: true,
    };
  } catch (error) {
    console.error(`Receive article-category/slug:${slug} Error:`, error);
    return {
      success: false,
      message: "Terjadi kesalahan saat terhubung ke server.",
    };
  }
}
