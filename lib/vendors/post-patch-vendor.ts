import { error } from "console";
import { success } from "zod";

const apiBaseUrl =
  process.env.NODE_ENV === "production"
    ? process.env.NEXT_PUBLIC_PROD_BACKEND_URL
    : process.env.NEXT_PUBLIC_DEV_BACKEND_URL;

export async function addVendor(payload: {
  name: string;
  en_description: string;
  id_description: string;
  category: string;
  specialist: string[];
  logo: string;
  highlight_image: string;
  reference_image: string[];
  location_map: string;
}) {
  try {
    console.log("Sending vendor/create to BE:", payload);
    const res = await fetch(`${apiBaseUrl}/api/v1/vendors`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (res.status !== 200 && res.status !== 201 && res.status !== 204) {
      return {
        success: false,
        error: `Failed to sent vendor/create data. Cause: ${res.status} - ${data.message}`,
      };
    }

    return {
      data,
      success: true,
    };
  } catch (error) {
    console.error("Sent vendor/create Error:", error);
    return {
      success: false,
      message: "Terjadi kesalahan saat terhubung ke server.",
    };
  }
}

export async function updateVendor(
  payload: {
    name?: string;
    en_description?: string;
    id_description?: string;
    category?: string;
    specialist?: string[];
    logo?: string;
    highlight_image?: string;
    reference_image?: string[];
    location_map?: string;
  },
  id: string
) {
  try {
    console.log("Sending vendor/update to BE:", payload);

    const res = await fetch(`${apiBaseUrl}/api/v1/vendors/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (res.status !== 200) {
      return {
        success: false,
        error: `Failed to sent vendor/update data. Cause: ${res.status} - ${data.message}`,
      };
    }

    return {
      data,
      success: true,
    };
  } catch (error) {
    console.error("Sent vendor/update Error:", error);
    return {
      success: false,
      message: "Terjadi kesalahan saat terhubung ke server.",
    };
  }
}
