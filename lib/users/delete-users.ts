"use server";

import { createClientAdmin } from "@/utils/supabase/admin";
import { deleteSingleFile } from "../image/deleteImage";
import { getLocale } from "next-intl/server";
import { revalidatePath } from "next/cache";

export async function deleteUsers(id: string) {
  if (!id) {
    return { error: "ID is required to delete users." };
  }
  try {
    console.log("Deleting user with ID:", id);
    const supabase = await createClientAdmin();

    const { data: user, error: userErr } = await supabase
      .from("accounts")
      .select("id, avatar_url")
      .eq("id", id)
      .single();

    if (userErr) {
      return {
        success: false,
        error: userErr.message,
      };
    }

    if (user?.avatar_url) {
      await deleteSingleFile(user.avatar_url);
    }

    const { data: userData, error: userError } =
      await supabase.auth.admin.deleteUser(id);

    if (userError) {
      console.error("Error deleting user:", userError);
      return {
        success: false,
        error: userError.message,
      };
    }

    const locale = await getLocale();
    revalidatePath(`/${locale}/studio/users`);

    return {
      userData,
      success: true,
    };
  } catch (error) {
    console.error("Sent users/delete Error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
      message: "Terjadi kesalahan saat terhubung ke server.",
    };
  }
}
