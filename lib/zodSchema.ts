import { z } from "zod";

import { parsePhoneNumberFromString } from "libphonenumber-js";

export const phoneSchema = z.string().refine((val) => {
  const cleaned = val.replace(/\D/g, "");
  const phone = parsePhoneNumberFromString(cleaned);
  return phone?.isValid();
}, "Nomor telepon tidak valid");

export const emailSchema = z.email("Format email tidak valid");

export const AuthSignInUpSchema = z.object({
  email: z.email("Email is Required."),
  password: z
    .string()
    .min(8, "Password is Required and must be at least 8 characters."),
});
