// lib/phoneSchema.ts
import { z } from "zod";
import { parsePhoneNumberFromString } from "libphonenumber-js";

export const phoneZod = z
  .string()
  .min(3)
  .refine(
    (val) => {
      try {
        const p = parsePhoneNumberFromString(val);
        return !!p && p.isValid();
      } catch {
        return false;
      }
    },
    { message: "Nomor telepon tidak valid" }
  );

// Jika kamu ingin schema yang menghasilkan (tranform) nilai yang sudah normal (E.164),
// gunakan transform + refine:
export const phoneZodNormalized = z
  .string()
  .transform((val) => {
    const cleaned = String(val).trim();
    const p = parsePhoneNumberFromString(cleaned);
    if (p && p.isValid()) return p.number; // E.164 => "+62812..."
    return cleaned;
  })
  .refine(
    (val) => {
      const p = parsePhoneNumberFromString(val);
      return !!p && p.isValid();
    },
    { message: "Nomor telepon tidak valid" }
  );
