"use server";

import { createClient } from "@/utils/supabase/server";
import { ErrorLogStatus } from "@/types/error-logs.types";
import { revalidatePath } from "next/cache";
import { getLocale } from "next-intl/server";

export async function patchErrorLogStatus(id: string, status: ErrorLogStatus) {
  try {
    const supabase = await createClient();

    const { error } = await supabase
      .from("errors")
      .update({ status })
      .eq("id", id);

    if (error) {
      return {
        success: false,
        error: `Failed to update error log status. Cause: ${error.message}`,
      };
    }

    const locale = await getLocale();
    revalidatePath(`/${locale}/studio/error-logs/${id}`);
    revalidatePath(`/${locale}/studio/error-logs`);

    return { success: true };
  } catch (error) {
    console.error("Patch error-log status error:", error);
    return {
      success: false,
      error: "Terjadi kesalahan saat terhubung ke server.",
    };
  }
}
export async function deleteErrorLog(id: string) {
  try {
    const supabase = await createClient();

    const { error } = await supabase.from("errors").delete().eq("id", id);

    if (error) {
      return {
        success: false,
        error: `Failed to delete error log. Cause: ${error.message}`,
      };
    }

    const locale = await getLocale();
    revalidatePath(`/${locale}/studio/error-logs`);

    return { success: true };
  } catch (error) {
    console.error("Delete error-log error:", error);
    return {
      success: false,
      error: "Terjadi kesalahan saat terhubung ke server.",
    };
  }
}
