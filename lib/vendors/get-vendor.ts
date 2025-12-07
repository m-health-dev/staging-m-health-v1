import { Message } from "@/components/chatbot/ChatStart";
import { error } from "console";
import { success } from "zod";

const apiBaseUrl =
  process.env.NODE_ENV === "production"
    ? process.env.NEXT_PUBLIC_PROD_BACKEND_URL
    : process.env.NEXT_PUBLIC_DEV_BACKEND_URL;

export async function getAllVendorWithoutPagination() {
  try {
    const res = await fetch(`${apiBaseUrl}/api/v1/vendors?per_page=all`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const json = await res.json();

    if (res.status !== 200) {
      return {
        success: false,
        error: `Failed to receive ALL vendor/read data. Cause : ${json.message}`,
      };
    }

    // console.log(json.links);
    return {
      data: json.data,
      success: true,
    };
  } catch (error) {
    console.error("Receive ALL vendor/read Error:", error);
    return {
      success: false,
      message: "Terjadi kesalahan saat terhubung ke server.",
    };
  }
}

export async function getAllVendor(page: number = 1, per_page: number = 10) {
  try {
    const res = await fetch(
      `${apiBaseUrl}/api/v1/vendors?page=${page}&per_page=${per_page}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const json = await res.json();

    if (res.status !== 200) {
      return {
        success: false,
        error: `Failed to receive vendor/read data. Cause : ${json.message}`,
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
    console.error("Receive vendor/read Error:", error);
    return {
      success: false,
      message: "Terjadi kesalahan saat terhubung ke server.",
    };
  }
}

export async function getVendorByID(id: string) {
  try {
    const res = await fetch(`${apiBaseUrl}/api/v1/vendors/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await res.json();

    if (res.status !== 200) {
      return {
        success: false,
        error: `Failed to receive vendor/read by ID ${id}. Cause : ${res.status} - ${data.message}`,
      };
    }

    return {
      data,
      success: true,
    };
  } catch (error) {
    console.error(`Receive vendor/id:${id} Error:`, error);
    return {
      success: false,
      message: "Terjadi kesalahan saat terhubung ke server.",
    };
  }
}
