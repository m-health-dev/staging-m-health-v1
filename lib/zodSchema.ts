import { z } from "zod";

import { parsePhoneNumberFromString } from "libphonenumber-js";

export const indonesiaPhoneSchema = z
  .string()
  .refine(
    (val) => /^08[0-9]{8,11}$/.test(val) || /^\+628[0-9]{8,11}$/.test(val),
    {
      message: "Nomor telepon Indonesia tidak valid",
    }
  );

export const phoneSchema = z.string().refine((val) => {
  const cleaned = val.replace(/\D/g, "");
  const phone = parsePhoneNumberFromString(cleaned);
  return phone?.isValid();
}, "Nomor telepon tidak valid");

export const emailSchema = z.email("Format email tidak valid");
