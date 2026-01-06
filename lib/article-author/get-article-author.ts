"use server";

import { apiSecretKey } from "@/helper/api-secret-key";
import { error } from "console";
import { success } from "zod";

const apiBaseUrl =
  process.env.NODE_ENV === "production"
    ? process.env.NEXT_PUBLIC_PROD_BACKEND_URL
    : process.env.NEXT_PUBLIC_DEV_BACKEND_URL;

export async function getAllArticleAuthorWithoutPagination() {
  try {
    const res = await fetch(`${apiBaseUrl}/api/v1/authors?per_page=all`, {
      method: "GET",
      headers: {
        "X-API-Key": apiSecretKey,
        "Content-Type": "application/json",
      },
    });

    const json = await res.json();

    if (res.status !== 200) {
      return {
        success: false,
        error: `Failed to receive ALL article-author/read data. Cause : ${json.message}`,
      };
    }

    // console.log({ json });
    return {
      data: json.data,
      success: true,
    };
  } catch (error) {
    console.error("Receive ALL article-author/read Error:", error);
    return {
      success: false,
      message: "Terjadi kesalahan saat terhubung ke server.",
    };
  }
}

export async function getAllArticleAuthor(
  page: number = 1,
  per_page: number = 10
) {
  try {
    const res = await fetch(
      `${apiBaseUrl}/api/v1/authors?page=${page}&per_page=${per_page}`,
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
        error: `Failed to receive article-author/read data. Cause : ${json.message}`,
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
    console.error("Receive article-author/read Error:", error);
    return {
      success: false,
      message: "Terjadi kesalahan saat terhubung ke server.",
    };
  }
}

export async function getArticleAuthorByID(id: string) {
  try {
    const res = await fetch(`${apiBaseUrl}/api/v1/authors/${id}`, {
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
        error: `Failed to receive article-author/read by ID ${id}. Cause : ${res.status} - ${json.message}`,
      };
    }

    return {
      data: json.data,
      success: true,
    };
  } catch (error) {
    console.error(`Receive article-author/id:${id} Error:`, error);
    return {
      success: false,
      message: "Terjadi kesalahan saat terhubung ke server.",
    };
  }
}

export async function getArticleAuthorBySlug(slug: string) {
  try {
    const res = await fetch(`${apiBaseUrl}/api/v1/authors/${slug}`, {
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
        error: `Failed to receive article-author/read by slug ${slug}. Cause : ${res.status} - ${data.message}`,
      };
    }

    return {
      data,
      success: true,
    };
  } catch (error) {
    console.error(`Receive article-author/slug:${slug} Error:`, error);
    return {
      success: false,
      message: "Terjadi kesalahan saat terhubung ke server.",
    };
  }
}
