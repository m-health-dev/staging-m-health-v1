"use server";

import { apiSecretKey } from "@/helper/api-secret-key";
import { error } from "console";
import { success } from "zod";

const apiBaseUrl =
  process.env.NODE_ENV === "production"
    ? process.env.NEXT_PUBLIC_PROD_BACKEND_URL
    : process.env.NEXT_PUBLIC_DEV_BACKEND_URL;

export async function getAllArticleWithoutPagination() {
  try {
    const res = await fetch(`${apiBaseUrl}/api/v1/articles?per_page=all`, {
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
        error: `Failed to receive ALL articles data. Cause : ${json.message}`,
      };
    }

    console.log({ json });
    return {
      data: json.data,
      success: true,
    };
  } catch (error) {
    console.error("Receive ALL articles/read Error:", error);
    return {
      success: false,
      message: "Terjadi kesalahan saat terhubung ke server.",
    };
  }
}

export async function getAllArticles(page: number = 1, per_page: number = 10) {
  try {
    const res = await fetch(
      `${apiBaseUrl}/api/v1/articles?page=${page}&per_page=${per_page}`,
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
        error: `Failed to receive articles data. Cause : ${json.message}`,
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
    console.error("Receive articles/read Error:", error);
    return {
      success: false,
      message: "Terjadi kesalahan saat terhubung ke server.",
    };
  }
}

export async function getAllPublicArticles(
  page: number = 1,
  per_page: number = 10
) {
  try {
    const res = await fetch(
      `${apiBaseUrl}/api/v1/articles?status=published&page=${page}&per_page=${per_page}`,
      {
        next: { revalidate: 60 },
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
        data: [],
        links: null,
        meta: null,
        total: 0,
        error: `Failed to receive articles/read data. Cause : ${json.message}`,
      };
    }

    // console.log(json.links);
    return {
      data: json.data,
      links: json.links,
      meta: json.meta,
      total: json.total,
      success: true,
    };
  } catch (error) {
    console.error("Receive articles/read Error:", error);
    return {
      success: false,
      message: "Terjadi kesalahan saat terhubung ke server.",
    };
  }
}

export async function getArticlesByID(id: string) {
  try {
    const res = await fetch(`${apiBaseUrl}/api/v1/articles/${id}`, {
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
        error: `Failed to receive articles by ID ${id}. Cause : ${res.status} - ${json.message}`,
      };
    }

    return {
      data: json.data,
      success: true,
    };
  } catch (error) {
    console.error(`Receive articles/id:${id} Error:`, error);
    return {
      success: false,
      message: "Terjadi kesalahan saat terhubung ke server.",
    };
  }
}

export async function getArticlesBySlug(slug: string) {
  try {
    const res = await fetch(`${apiBaseUrl}/api/v1/articles/${slug}`, {
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
        error: `Failed to receive articles by slug ${slug}. Cause : ${res.status} - ${data.message}`,
      };
    }

    return {
      data,
      success: true,
    };
  } catch (error) {
    console.error(`Receive articles/slug:${slug} Error:`, error);
    return {
      success: false,
      message: "Terjadi kesalahan saat terhubung ke server.",
    };
  }
}
