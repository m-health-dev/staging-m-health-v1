import { z } from "zod";

import { parsePhoneNumberFromString } from "libphonenumber-js";

export const phoneSchema = z.string().refine((val) => {
  const cleaned = val.replace(/\D/g, "");
  const phone = parsePhoneNumberFromString(cleaned);
  return phone?.isValid();
}, "Nomor telepon tidak valid");

export const emailSchema = z.email("Format email tidak valid");

export const AuthSignInSchema = z.object({
  email: z.email("Email is Required."),
  password: z
    .string()
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_])[A-Za-z\d\W_]{8,}$/, {
      message:
        "Gunakan setidaknya 8 karakter dan memiliki huruf besar, huruf kecil, angka, dan karakter spesial",
    }),
  redirect: z.string(),
});

export const AuthSignUpSchema = z.object({
  fullname: z.string().min(3, "Full Name is Required."),
  email: z.email("Email is Required."),
  password: z
    .string()
    .min(8, "Password is Required and must be at least 8 characters."),
});

export const ForgotPassSchema = z.object({
  email: z.email("Email is Required."),
  // callbackUrl: z.string(),
});

export const resetPasswordSchema = z.object({
  password: z
    .string()
    .min(8, {
      message: "Kami mengharuskan password berisi setidaknya 8 karakter",
    })
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_])[A-Za-z\d\W_]{8,}$/, {
      message:
        "Gunakan setidaknya 8 karakter dan memiliki huruf besar, huruf kecil, angka, serta karakter spesial",
    }),
  confirmPassword: z
    .string()
    .min(8, {
      message: "Kami mengharuskan password berisi setidaknya 8 karakter",
    })
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_])[A-Za-z\d\W_]{8,}$/, {
      message:
        "Gunakan setidaknya 8 karakter dan memiliki huruf besar, huruf kecil, angka, serta karakter spesial",
    }),
});

export const OTPSignInSchema = z.object({
  email: z.email("Email is Required."),
  otp: z.string().min(6, "OTP is Required and must be 6 characters."),
});

export const RequestOTPSchema = z.object({
  email: z.email(),
});

export const VerifyOTPSchema = z.object({
  email: z.email(),
  otp: z.string().min(6),
});
