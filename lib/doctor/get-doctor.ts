"use server";

import { apiSecretKey } from "@/helper/api-secret-key";

const apiBaseUrl =
  process.env.NODE_ENV === "production"
    ? process.env.NEXT_PUBLIC_PROD_BACKEND_URL
    : process.env.NEXT_PUBLIC_DEV_BACKEND_URL;

export async function getAllDoctorsWithoutPagination() {
  try {
    const res = await fetch(`${apiBaseUrl}/api/v1/doctors?per_page=all`, {
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
        error: `Failed to receive ALL doctors/read data. Cause : ${json.message}`,
      };
    }

    console.log({ json });
    return {
      data: json.data,
      success: true,
    };
  } catch (error) {
    console.error("Receive ALL doctors/read Error:", error);
    return {
      success: false,
      message: "Terjadi kesalahan saat terhubung ke server.",
    };
  }
}

export async function getAllDoctors(page: number = 1, per_page: number = 10) {
  try {
    const res = await fetch(
      `${apiBaseUrl}/api/v1/doctors?page=${page}&per_page=${per_page}`,
      {
        cache: "no-store",
        method: "GET",
        headers: {
          "X-API-Key": apiSecretKey,
          "Content-Type": "application/json",
        },
      },
    );

    const json = await res.json();

    if (res.status !== 200) {
      return {
        success: false,
        error: `Failed to receive doctor/read data. Cause : ${json.message}`,
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
    console.error("Receive doctor/read Error:", error);
    return {
      success: false,
      message: "Terjadi kesalahan saat terhubung ke server.",
    };
  }
}

export async function getAllAvailableDoctors(
  page: number = 1,
  per_page: number = 10,
) {
  try {
    const res = await fetch(
      `${apiBaseUrl}/api/v1/doctors/available?page=${page}&per_page=${per_page}`,
      {
        // next: { revalidate: 60 },
        method: "GET",
        headers: {
          "X-API-Key": apiSecretKey,
          "Content-Type": "application/json",
        },
      },
    );

    const json = await res.json();

    if (res.status !== 200) {
      return {
        success: false,
        data: [],
        links: null,
        meta: null,
        error: `Failed to receive doctors-available/read data. Cause : ${json.message}`,
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
    console.error("Receive doctors-available/read Error:", error);
    return {
      success: false,
      message: "Terjadi kesalahan saat terhubung ke server.",
    };
  }
}

export async function getDoctorsByID(id: string) {
  try {
    const res = await fetch(`${apiBaseUrl}/api/v1/doctors/${id}`, {
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
        error: `Failed to receive doctors/read by ID ${id}. Cause : ${res.status} - ${data.message}`,
      };
    }

    return {
      data: data.data,
      success: true,
    };
  } catch (error) {
    console.error(`Receive doctors/id:${id} Error:`, error);
    return {
      success: false,
      message: "Terjadi kesalahan saat terhubung ke server.",
    };
  }
}

export async function getDoctorsBySlug(slug: string) {
  try {
    const res = await fetch(`${apiBaseUrl}/api/v1/doctors/${slug}`, {
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
        error: `Failed to receive doctors/read by slug ${slug}. Cause : ${res.status} - ${data.message}`,
      };
    }

    return {
      data,
      success: true,
    };
  } catch (error) {
    console.error(`Receive doctors/slug:${slug} Error:`, error);
    return {
      success: false,
      message: "Terjadi kesalahan saat terhubung ke server.",
    };
  }
}
