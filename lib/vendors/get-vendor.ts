import { Message } from "@/components/chatbot/ChatStart";
import { error } from "console";
import { success } from "zod";

const apiBaseUrl =
  process.env.NODE_ENV === "production"
    ? process.env.NEXT_PUBLIC_PROD_BACKEND_URL
    : process.env.NEXT_PUBLIC_DEV_BACKEND_URL;

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

    if (!json) {
      return { success: false, error: "Failed to receive vendor data." };
    }

    console.log(json.links);
    return {
      data: json.data, // data vendor
      links: json.links, // navigasi URL
      meta: json.meta,
      success: true,
    };
  } catch (error) {
    console.error("Receive Vendor Error:", error);
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

    if (!data) {
      return {
        success: false,
        error: `Failed to receive vendor/id:${id} data.`,
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
