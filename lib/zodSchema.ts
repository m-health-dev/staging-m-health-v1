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
    .min(8, "Password is Required and must be at least 8 characters."),
});

export const AuthSignUpSchema = z.object({
  full_name: z.string().min(3, "Full Name is Required."),
  email: z.email("Email is Required."),
  password: z
    .string()
    .min(8, "Password is Required and must be at least 8 characters."),
});

export const ForgotPassSchema = z.object({
  email: z.email("Email is Required."),
});

export const OTPSignInSchema = z.object({
  email: z.email("Email is Required."),
  otp: z.string().min(6, "OTP is Required and must be 6 characters."),
});
