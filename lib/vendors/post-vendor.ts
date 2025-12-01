import { Message } from "@/components/chatbot/ChatStart";
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
    console.log("Sending Vendor to BE:", payload);
    const res = await fetch(`${apiBaseUrl}/api/v1/vendors`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (!data) {
      return { success: false, error: "Failed to sent vendor data." };
    }

    return {
      data,
      success: true,
    };
  } catch (error) {
    console.error("Sent Vendor Error:", error);
    return {
      success: false,
      message: "Terjadi kesalahan saat terhubung ke server.",
    };
  }
}
