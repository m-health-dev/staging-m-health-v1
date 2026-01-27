"use server";

import { cookies, headers } from "next/headers";
import z, { check, success } from "zod";

import crypto from "crypto";
import { redirect } from "next/navigation";
import { getAuthTypes } from "@/utils/supabase/getAuthTypes";
import { createClientAdmin } from "@/utils/supabase/admin";
import { createClient } from "@/utils/supabase/server";

import { getLocale } from "next-intl/server";
import {
  AuthSignInSchema,
  AuthSignUpSchema,
  ForgotPassSchema,
} from "@/lib/zodSchema";

import sha1 from "crypto-js/sha1";
import { NextResponse } from "next/server";
import { use } from "react";

// const signInSchema = z.object({
//   email: z
//     .string()
//     .min(5)
//     .regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/),
//   password: z
//     .string()
//     .min(8)
//     .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_])[A-Za-z\d\W_]{8,}$/),
//   redirect: z.string(),
// });
const magicSchema = z.object({
  email: z
    .string()
    .min(5)
    .regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/),
});

const resetPasswordSchema = z.object({
  password: z
    .string()
    .min(8)
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_])[A-Za-z\d\W_]{8,}$/),
  confirmPassword: z
    .string()
    .min(8)
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_])[A-Za-z\d\W_]{8,}$/),
});

export async function getUserRole() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();

  if (error || !data) return "N/A";

  const claims = data.claims as any;
  return claims.user_role ?? "N/A";
}

export async function getAccessToken() {
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  return session?.access_token;
}

export async function getUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user;
}

const getBaseUrl = (): string => {
  // Always prioritize environment variable for production
  if (process.env.NEXT_PUBLIC_BASE_URL) {
    return process.env.NEXT_PUBLIC_BASE_URL;
  }
  // Fallback for development
  return "http://localhost:3030";
};

export const signUpAction = async (
  data: {
    fullname: string;
    email: string;
    password: string;
  },
  captchaToken: string,
) => {
  const supabase = await createClient();
  const origin = getBaseUrl();
  const validatedData = AuthSignUpSchema.safeParse(data);

  if (!validatedData.success) {
    return {
      errors: validatedData.error.cause,
    };
  }

  if (!validatedData.data.email || !validatedData.data.password) {
    return {
      error: {
        id: "Email dan password wajib diisi. - 0X1IEP",
        en: "Email and password are required. - 0X1IEP",
      },
    };
  }

  // Check if password has been pwned
  const hashedPassword = crypto
    .createHash("sha1")
    .update(validatedData.data.password)
    .digest("hex")
    .toUpperCase();
  const prefix = hashedPassword.slice(0, 5);
  const suffix = hashedPassword.slice(5);

  try {
    const response = await fetch(
      `https://api.pwnedpasswords.com/range/${prefix}`,
    );
    const text = await response.text();
    const breachedHashes = text.split("\n");

    for (const hash of breachedHashes) {
      const [hashSuffix, count] = hash.split(":");
      const localCount = Number(count).toLocaleString(`id-ID`);
      if (hashSuffix === suffix) {
        return {
          error: {
            id: `Password ini telah ditemukan sebanyak ${localCount} kali dalam kebocoran data. Silakan pilih password lain yang lebih aman. - 0X1PWB`,
            en: `This password has been found ${localCount} times in data breaches. Please choose a different, more secure password. - 0X1PWB`,
          },
        };
      }
    }
  } catch (error) {
    console.error("Error checking password breach:", error);
    // If the API check fails, we'll continue with the sign-up process
  }

  const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
    email: validatedData.data.email,
    password: validatedData.data.password,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
      captchaToken,
    },
  });

  const { data: insertFullname, error: errInsertFullname } = await supabase
    .from("accounts")
    .update({ fullname: validatedData.data.fullname })
    .eq("id", signUpData.user?.id);

  if (errInsertFullname) {
    console.error(
      `${errInsertFullname.code}: ${
        errInsertFullname.message ||
        "Terjadi kesalahan saat melakukan pengiriman nama."
      }`,
    );
  }

  if (signUpError) {
    console.error(
      `${signUpError.code}: ${
        signUpError.message || "Terjadi kesalahan saat melakukan pendaftaran."
      }`,
    );

    if (signUpError?.code === "weak_password") {
      return {
        warning: {
          id: "Password yang kamu gunakan terlalu lemah. Silahkan gunakan kombinasi huruf besar, huruf kecil, angka, dan karakter spesial dengan minimal 8 karakter. - 0X1WP",
          en: "The password you used is too weak. Please use a combination of uppercase letters, lowercase letters, numbers, and special characters with a minimum of 8 characters. - 0X1WP",
        },
      };
    }

    return {
      error: {
        id: `${signUpError.message} - 0X1ERX`,
        en: `${signUpError.message} - 0X1ERX`,
      },
    };
  } else if (
    signUpData.user &&
    signUpData.user.identities &&
    signUpData.user.identities.length === 0
  ) {
    return {
      warning: {
        id: "Registrasi gagal. Silahkan coba lagi atau gunakan metode pendaftaran lainnya. - 0X1SF",
        en: "Registration failed. Please try again or use another sign-up method. - 0X1SF",
      },
    };
  } else {
    return {
      success: {
        id: "Terima kasih telah mendaftar! Silakan periksa email Anda untuk link verifikasi.",
        en: "Thank you for signing up! Please check your email for the verification link.",
      },
      user_id: signUpData.user?.id,
    };
  }
};

export const signInAction = async (
  data: {
    email: string;
    password: string;
    redirect: string;
  },
  captchaToken: string,
) => {
  const supabase = await createClient();
  const validatedData = AuthSignInSchema.safeParse(data);
  const locale = await getLocale();

  // console.log("validatedData:", validatedData);

  if (!validatedData.success) {
    return {
      success: false,
      errors: validatedData.error.cause,
    };
  }

  if (!validatedData.data.email || !validatedData.data.password) {
    return {
      error: {
        id: "Email dan password wajib diisi. - 0X2IEP",
        en: "Email and password are required. - 0X2IEP",
      },
    };
  }

  const { data: user, error } = await supabase.auth.signInWithPassword({
    email: validatedData.data?.email,
    password: validatedData.data?.password,
    options: {
      captchaToken,
    },
  });

  // console.log(user);

  const userRole = await getUserRole();

  let redirectTo = "";

  if (validatedData.data.redirect.startsWith(`/${locale}/c`)) {
    redirectTo = validatedData.data.redirect;
  } else if (userRole === "admin") {
    redirectTo = `/${locale}/studio`;
  } else if (userRole === "user") {
    redirectTo = `/${locale}/dashboard`;
  }

  // const redirectTo =
  //   (validatedData.data?.redirect as string) && userRole === "admin"
  //     ? `/${locale}/studio`
  //     : validatedData.data?.redirect || `/${locale}/dashboard`;

  if (error) {
    console.error(error.code + " " + error.message);
    if (error?.code === "unexpected_failure") {
      return {
        error: {
          id: "Terjadi kesalahan yang tidak diketahui. Silakan coba lagi. Jika, masalah ini terus terjadi hubungi kami di halaman bantuan. - 0X2UF",
          en: "An unknown error occurred. Please try again. If this problem persists, contact us on the help page. - 0X2UF",
        },
      };
    } else if (error?.code === "invalid_credentials") {
      return {
        error: {
          id: "Silahkan cek kembali email dan password yang kamu gunakan. - 0X2IC",
          en: "Please check the email and password you used. - 0X2IC",
        },
      };
    } else if (error?.code === "email_not_confirmed") {
      return {
        warning: {
          id: "Silahkan cek email kamu dan konfirmasi email yang kamu gunakan. - 0X2ENC",
          en: "Please check your email and confirm the email you used. - 0X2ENC",
        },
      };
    } else if (error?.code === "user_banned") {
      return {
        error: {
          id: "Akun kamu telah ditangguhkan. Untuk informasi selengkapnya silahkan hubungi kami di halaman bantuan. - 0X2BAN",
          en: "Your account has been suspended. For more information, please contact us on the help page. - 0X2BAN",
        },
      };
    } else if (error?.code === "captcha_failed") {
      return {
        error: {
          id: "Verifikasi captcha gagal, silahkan mulai ulang halaman untuk melanjutkan. - 0X2CF",
          en: "Captcha verification failed, please reload the page to continue. - 0X2CF",
        },
      };
    } else if (error.code) {
      return {
        error: {
          id: `${error.message} - 0X2ERX`,
          en: `${error.message} - 0X2ERX`,
        },
      };
    }
  } else {
    return redirect(redirectTo);
  }
};

export const handleSendMagicLinkAction = async (
  data: { email: string },
  captchaToken: string,
) => {
  const supabase = await createClient();
  const origin = getBaseUrl();

  const validatedData = magicSchema.safeParse(data);

  if (!validatedData.success) {
    return {
      success: false,
      errors: validatedData.error.cause,
    };
  }

  if (!validatedData.data.email) {
    return {
      error: {
        id: "Email are required - 0X3IE",
        en: "Email are required - 0X3IE",
      },
    };
  }

  let options = {
    emailRedirectTo: `${origin}/auth/callback`,
    shouldCreateUser: true,
    captchaToken,
  };

  const { allowPassword } = getAuthTypes();
  if (allowPassword) options.shouldCreateUser = false;

  const { error } = await supabase.auth.signInWithOtp({
    email: validatedData.data.email,
    options: options,
  });

  if (error?.code == `otp_disabled`) {
    console.error(error.code + " " + error.message);
    return {
      warning: {
        id: "Kamu tidak dapat menggunakan Magic Link untuk registrasi akun. - 0X3CUR",
        en: "You cannot use Magic Link to register an account. - 0X3CUR",
      },
    };
    // return encodedRedirect("error", "/magic", "Pengiriman OTP Gagal. Kamu tidak dapat menggunakan metode OTP untuk registrasi akun.");
  } else if (error) {
    console.error(error.code + " " + error.message);
    return {
      warning: {
        id: `${error.message} - 0X3ER`,
        en: `${error.message} - 0X3ER`,
      },
    };
    // return encodedRedirect("error", "/magic", "Silahkan cek kembali email yang kamu kirimkan.");
  }
  return {
    success: {
      id: "Silahkan cek email anda, kami telah mengirimkan tautan untuk masuk. ",
      en: "Please check your email, we have sent a link to log in. ",
    },
  };
  // return encodedRedirect(
  //   "success",
  //   "/magic/verify",
  //   "Link verifikasi telah terkirim. Silahkan cek email kamu."
  // );
};

// export const handleSendOTPAction = async (data: { email: string }) => {
//   const supabase = await createClient();
//   const origin = (await headers()).get("origin");

//   const validatedData = emailSchema.safeParse(data);

//   if (!validatedData.success) {
//     return {
//       success: false,
//       errors: validatedData.error.cause,
//     };
//   }

//   if (!validatedData.data.email) {
//     return { error: "Email are required" };
//   }

//   let options = {
//     emailRedirectTo: `${origin}/auth/callback`,
//     shouldCreateUser: true,
//   };

//   const { allowPassword } = getAuthTypes();
//   if (allowPassword) options.shouldCreateUser = false;

//   const { error } = await supabase.auth.signInWithOtp({
//     email: validatedData.data.email,
//     options: options,
//   });

//   if (error?.code == `otp_disabled`) {
//     console.error(error.code + " " + error.message);
//     return {
//       warning: "Kamu tidak dapat menggunakan Magic Link untuk registrasi akun.",
//     };
//     // return encodedRedirect("error", "/magic", "Pengiriman OTP Gagal. Kamu tidak dapat menggunakan metode OTP untuk registrasi akun.");
//   } else if (error?.code === "unexpected_failure") {
//     return {
//       error:
//         "Terjadi kesalahan yang tidak diketahui. Silakan coba lagi. Jika, masalah ini terus terjadi hubungi kami di halaman bantuan.",
//     };
//   } else if (error) {
//     console.error(error.code + " " + error.message);
//     return { warning: error.message };
//     // return encodedRedirect("error", "/magic", "Silahkan cek kembali email yang kamu kirimkan.");
//   }
//   // return encodedRedirect("req", "/otp/verify", `${validatedData.data.email}`)
//   return redirect(`/one-time/verify?email=${validatedData.data.email}`);
// };

// export const handleVerifyOTPAction = async (data: {
//   email: string;
//   otp: string;
// }) => {
//   const supabase = await createClient();
//   const validatedData = otpSchema.safeParse(data);

//   if (!validatedData.success) {
//     return {
//       success: false,
//       errors: validatedData.error.cause,
//     };
//   }

//   const {
//     data: { session },
//     error,
//   } = await supabase.auth.verifyOtp({
//     email: validatedData.data.email,
//     token: validatedData.data.otp,
//     type: "email",
//   });

//   if (error) {
//     console.error(error.code + " " + error.message);
//     if (error.code === "invalid_otp") {
//       return { warning: "Kode OTP tidak valid. Silakan coba lagi." };
//     } else {
//       return {
//         error: "Terjadi kesalahan saat memverifikasi OTP. Silakan coba lagi.",
//       };
//     }
//   }

//   if (!session) {
//     return { error: "Sesi tidak berhasil dibuat. Silakan coba lagi." };
//   }

//   return redirect("/dashboard");
// };

export const signWithGoogle = async (redirectTo?: string) => {
  const supabase = await createClient();
  const origin = getBaseUrl();

  // const redirectTo = (formData.get("redirect") as string) || "/nusa";

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",

    options: {
      redirectTo: `${origin}/auth/oauth?next=${encodeURIComponent(
        redirectTo?.replace(process.env.NEXT_PUBLIC_BASE_URL || "", "") ||
          "/dashboard",
      )}`,

      // queryParams: {
      //   access_type: "offline",
      //   prompt: "consent",
      // },
    },
  });
  if (error) {
    console.error(error.code + " " + error.message);
    if (error?.code === "unexpected_failure") {
      return {
        error: {
          id: "Terjadi kesalahan yang tidak diketahui. Silakan coba lagi. Jika, masalah ini terus terjadi hubungi kami di halaman bantuan. - 0X4UF",
          en: "An unknown error occurred. Please try again. If this problem persists, contact us on the help page. - 0X4UF",
        },
      };
    } else if (error?.code === "invalid_credentials") {
      return {
        warning: {
          id: "Silahkan cek kembali email dan password yang kamu gunakan. - 0X4IC",
          en: "Please check the email and password you used. - 0X4IC",
        },
      };
    } else if (error?.code === "email_not_confirmed") {
      return {
        warning: {
          id: "Silahkan cek email kamu dan konfirmasi email yang kamu gunakan. - 0X4ENC",
          en: "Please check your email and confirm the email you used. - 0X4ENC",
        },
      };
    } else if (error.code) {
      return { error: `${error.message}` };
    }
  }

  if (data?.url) {
    return redirect(data.url);
  }

  // return redirect(redirectTo);
};

export const forgotPasswordAction = async (
  data: { email: string },
  captchaToken: string,
) => {
  const supabase = await createClient();
  const validatedData = ForgotPassSchema.safeParse(data);
  const origin = getBaseUrl();
  const locale = await getLocale();
  // const callbackUrl = formData.get("callbackUrl")?.toString();

  if (!validatedData.success) {
    return {
      success: false,
      errors: validatedData.error.cause,
    };
  }

  if (!validatedData.data.email) {
    return {
      error: {
        id: "Email harus diisi. - 0X5ER",
        en: "Email are required. - 0X5ER",
      },
    };
  }

  // Cek jumlah permintaan reset berdasarkan email
  const { data: checkRequested, error: reqErr } = await supabase
    .from("recover_account")
    .select("*")
    .eq("email", validatedData.data.email)
    .maybeSingle();

  if (reqErr) {
    return {
      success: false,
      error: {
        id: "Terjadi kesalahan saat memeriksa permintaan reset. - 0X5CRRA",
        en: "An error occurred while checking the reset request. - 0X5CRRA",
      },
    };
  }

  // Jika sudah pernah tercatat dan melebihi batas
  if (checkRequested && checkRequested.request >= 3) {
    return {
      success: false,
      error: {
        id: "Anda sudah melakukan percobaan reset password sebanyak 3 (tiga) kali. Silahkan hubungi dukungan. - 0X5MRR",
        en: "You have attempted to reset your password 3 (three) times. Please contact support. - 0X5MRR",
      },
    };
  }

  // Hitung request baru
  const newRequestCount = (checkRequested?.request ?? 0) + 1;

  // Lakukan UPSERT sederhana tanpa .select()
  const { error: updateErr } = await supabase
    .from("recover_account")
    .update({
      email: validatedData.data.email,
      request: newRequestCount,
      updated_at: new Date().toISOString(),
    })
    .eq("email", validatedData.data.email);

  if (updateErr) {
    console.error("UPSERT ERROR:", updateErr);
    return {
      success: false,
      error: {
        id: "Tidak dapat memperbarui data permintaan reset. - 0X5URX",
        en: "Cannot update reset request data. - 0X5URX",
      },
    };
  }

  // Ambil nilai request terbaru setelah sukses
  const { data: finalData, error: selectErr } = await supabase
    .from("recover_account")
    .select("request")
    .eq("email", validatedData.data.email)
    .single();

  if (selectErr) {
    console.error("SELECT ERROR:", selectErr);
    return {
      success: false,
      error: {
        id: "Tidak dapat mengambil data permintaan reset. - 0X5GRX",
        en: "Cannot retrieve reset request data. - 0X5GRX",
      },
    };
  }

  console.log("Request Recover :", finalData?.request);

  // Cek apakah email ada di tabel accounts
  const { data: checkEmail, error: emailErr } = await supabase
    .from("accounts")
    .select("*")
    .eq("email", validatedData.data.email)
    .maybeSingle();

  if (emailErr) {
    return {
      success: false,
      error: {
        id: "Terjadi kesalahan saat memeriksa email. - 0X5CEX",
        en: "An error occurred while checking the email. - 0X5CEX",
      },
    };
  }

  if (!checkEmail) {
    return {
      success: false,
      error: {
        id: "Email tidak terdata dalam basis data kami. - 0X5NED",
        en: "Email is not registered in our database. - 0X5NED",
      },
    };
  }

  const { error } = await supabase.auth.resetPasswordForEmail(
    validatedData.data.email,

    {
      redirectTo: `${origin}/auth/callback?redirect=/${locale}/reset-password`,
    },
  );

  if (error) {
    console.error(error.code + " " + error.message);
    return {
      warning: {
        id: "Terjadi kesalahan saat mengirimkan email reset password. Silahkan coba lagi. - 0X5ERX",
        en: "An error occurred while sending the password reset email. Please try again. - 0X5ERX",
      },
    };
  }

  // if (validatedData.data.callbackUrl) {
  //   return {
  //     success:
  //       "Silahkan cek email kamu, Kami telah mengirimkan tautan untuk Reset Password.",
  //   };
  // }

  return {
    success: true,
    message: {
      id: "Silahkan cek email kamu, Kami telah mengirimkan tautan untuk Reset Password.",
      en: "Please check your email, we have sent a link to Reset Password.",
    },
  };
};

export const resetPasswordAction = async (
  data: {
    password: string;
    confirmPassword: string;
  },
  captchaToken: string,
) => {
  const supabase = await createClient();
  const validatedData = resetPasswordSchema.safeParse(data);
  const locale = await getLocale();

  if (!validatedData.success) {
    return {
      success: false,
      errors: validatedData.error.cause,
    };
  }

  if (!validatedData.data.password || !validatedData.data.confirmPassword) {
    return {
      warning: {
        id: "Password dan konfirmasi password wajib diisi. - 0X6IEP",
        en: "Password and confirm password are required. - 0X6IEP",
      },
    };
  }

  if (validatedData.data.password !== validatedData.data.confirmPassword) {
    return {
      warning: {
        id: "Password tidak sama. - 0X6IEQ",
        en: "Passwords do not match. - 0X6IEQ",
      },
    };
  }

  const hashedPasswordSHA = sha1(validatedData.data.confirmPassword);
  const hashedPassword = hashedPasswordSHA.toString().toUpperCase();
  // .createHash("sha1")
  // .update(validatedData.data.confirmPassword)
  // .digest("hex")

  // Check if password has been pwned
  // const hashedPassword = crypto
  //   .createHash("sha1")
  //   .update(validatedData.data.confirmPassword)
  //   .digest("hex")
  //   .toUpperCase();
  const prefix = hashedPassword.slice(0, 5);
  const suffix = hashedPassword.slice(5);

  try {
    const response = await fetch(
      `https://api.pwnedpasswords.com/range/${prefix}`,
    );
    const text = await response.text();
    const breachedHashes = text.split("\n");

    for (const hash of breachedHashes) {
      const [hashSuffix, count] = hash.split(":");
      const localCount = Number(count).toLocaleString(`id-ID`);
      if (hashSuffix === suffix) {
        return {
          error: {
            id: `Password ini telah ditemukan sebanyak ${localCount} kali dalam kebocoran data. Silakan pilih password lain yang lebih aman. - 0X6PWB`,
            en: `This password has been found ${localCount} times in data breaches. Please choose a different, more secure password. - 0X6PWB`,
          },
        };
      }
    }
  } catch (error) {
    console.error("Error checking password breach:", error);
    // If the API check fails, we'll continue with the sign-up process
  }

  const { error } = await supabase.auth.updateUser({
    password: validatedData.data.confirmPassword,
  });

  const { data: user } = await supabase.auth.getUser();

  const { data: checkRequested, error: reqErr } = await supabase
    .from("recover_account")
    .select("*")
    .eq("email", user.user?.email)
    .maybeSingle();

  if (error) {
    if (error.code === "same_password") {
      return {
        warning: {
          id: "Mohon gunakan kombinasi password lainnya. - 0X6SP",
          en: "Please use a different password combination. - 0X6SP",
        },
      };
    }
    console.error(error.code + " " + error.message);
    return {
      error: {
        id: "Terjadi kesalahan saat memperbarui password. Silahkan coba lagi. - 0X6ERX",
        en: "An error occurred while updating the password. Please try again. - 0X6ERX",
      },
    };
  }

  await supabase.auth.signOut();
  return (
    redirect(
      `/${locale}/sign-in?reset=success&email=${user.user?.email}&record=${checkRequested.request}`,
    ),
    {
      success: {
        id: "Password berhasil diperbarui. Silahkan login kembali.",
        en: "Password updated successfully. Please log in again.",
      },
    }
  );
};

export const signOutAction = async () => {
  const supabase = await createClient();
  await supabase.auth.signOut();
  return redirect("/?sign_out=success");
};

export async function deleteUser() {
  const supabase = await createClient();
  const cookieStore = cookies();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data, error: fetchError } = await supabase
    .from("accounts")
    .select("avatar_url")
    .eq("id", user?.id)
    .single();
  const { data: files, error: listError } = await supabase.storage
    .from("avatars")
    .list("", {
      offset: 0,
      sortBy: { column: "name", order: "asc" },
      search: `${user?.id}`,
    });

  console.log(
    "from bucket:",
    files?.map((file) => `${file.name}`),
  );

  if (!files) {
    return { error: "Avatar not found!" };
  }

  const fileToDelete = files.map((file) => `${file.name}`);

  if (!user) {
    return { error: "User not found" };
  }

  if (fetchError) {
    return { error: "Avatar not found", fetchError };
  }

  const supabaseAdmin = await createClientAdmin();

  try {
    const { error: storageError } = await supabase.storage
      .from("avatars")
      .remove(fileToDelete); // Hapus file avatar dari storage

    if (storageError) {
      throw new Error(
        `Failed to delete avatar from storage: ${storageError.message}`,
      );
    }

    // Delete user data (replace 'your_data_table' with your actual table name)
    const { error: deleteDataError } = await supabase
      .from("account")
      .delete()
      .eq("id", user.id);

    if (deleteDataError) {
      throw new Error("Failed to delete user data");
    }

    // Delete the user
    const { error: deleteUserError } =
      await supabaseAdmin.auth.admin.deleteUser(user.id);

    if (deleteUserError) {
      throw new Error("Failed to delete user account");
    }

    // Sign out the user
    await supabase.auth.signOut();

    return { success: true };
  } catch (error) {
    return {
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}
