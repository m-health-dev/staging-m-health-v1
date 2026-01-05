import { createClient } from "@/utils/supabase/server";

export type RecoveryAccountRow = {
  id: string;
  email: string;
  created_at: string;
  updated_at: string | null;
  request: number;
};

export async function getUsersRecovery({ email }: { email?: string }) {
  const supabase = await createClient();
  try {
    if (!email) {
      return {
        success: false,
        error: "Email is required.",
      };
    }

    const { data, error } = await supabase
      .from("recover_account")
      .select("id, email, created_at, updated_at, request")
      .eq("email", email)
      .maybeSingle();

    if (error) {
      return {
        success: false,
        error: `Failed to receive recover account data. Cause : ${error.message}`,
      };
    }

    console.log({ data });
    return {
      data: data as RecoveryAccountRow | null,
      success: true,
    };
  } catch (error) {
    console.error("Receive recover account Error:", error);
    return {
      success: false,
      message: "Terjadi kesalahan saat terhubung ke server.",
    };
  }
}

export async function getRecoveryUserById({ id }: { id: string }) {
  const supabase = await createClient();
  try {
    if (!id) {
      return {
        success: false,
        error: "ID is required.",
      };
    }

    const { data, error } = await supabase
      .from("recover_account")
      .select("id, email, created_at, updated_at, request")
      .eq("id", id)
      .maybeSingle();

    if (error) {
      return {
        success: false,
        error: `Failed to receive recover account data. Cause : ${error.message}`,
      };
    }

    return {
      data: data as RecoveryAccountRow | null,
      success: true,
    };
  } catch (error) {
    console.error("Receive recover account by id Error:", error);
    return {
      success: false,
      message: "Terjadi kesalahan saat terhubung ke server.",
    };
  }
}

export async function ResetUsersRecovery({ id }: { id?: string }) {
  const supabase = await createClient();
  try {
    if (!id) {
      return {
        success: false,
        error: "ID is required.",
      };
    }

    const { data, error } = await supabase
      .from("recover_account")
      .update({ request: 0, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select("id, email, created_at, updated_at, request")
      .maybeSingle();

    if (error) {
      return {
        success: false,
        error: `Failed to reset recover account data. Cause : ${error.message}`,
      };
    }

    console.log({ data });
    return {
      data: data as RecoveryAccountRow | null,
      success: true,
    };
  } catch (error) {
    console.error("Reset recover account Error:", error);
    return {
      success: false,
      message: "Terjadi kesalahan saat terhubung ke server.",
    };
  }
}

export async function resetRecoveryUser({ id }: { id: string }) {
  return ResetUsersRecovery({ id });
}
