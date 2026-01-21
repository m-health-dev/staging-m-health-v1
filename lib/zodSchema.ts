import { z } from "zod";

import { parsePhoneNumberFromString } from "libphonenumber-js";
import { title } from "node:process";

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

export const VendorSchema = z.object({
  name: z.string().min(3),
  en_description: z.string().min(3),
  id_description: z.string().min(3),
  category: z.string().min(3),
  specialist: z.array(z.string()),
  logo: z.string().min(1),
  highlight_image: z.string().min(1),
  reference_image: z.array(z.string()).min(1),
  location_map: z.url().min(1),
  location: z.string().min(1),
  insurance_id: z.array(z.string()),
});

export const InsuranceSchema = z.object({
  name: z.string().min(3),
  en_description: z.string().min(3),
  id_description: z.string().min(3),
  category: z.array(z.string()).min(1),
  specialist: z.array(z.string()).min(1),
  logo: z.string().min(1),
  highlight_image: z.string().min(1),
  agent_name: z.string().min(1),
  agent_number: z.string().min(5),
  agent_photo_url: z.string().min(1),
});

export const HotelSchema = z.object({
  name: z.string().min(3),
  en_description: z.string().min(3),
  id_description: z.string().min(3),
  logo: z.string().min(1),
  highlight_image: z.string().min(1),
  reference_image: z.array(z.string().min(1)),
  location_map: z.url().min(1),
  location: z.string().min(1),
});

export const WellnessSchema = z.object({
  en_title: z.string().min(3),
  id_title: z.string().min(3),
  en_tagline: z.string().min(3),
  id_tagline: z.string().min(3),
  highlight_image: z.string().min(1),
  reference_image: z.array(z.string().min(1)),
  duration_by_day: z.number(),
  duration_by_night: z.number().optional(),
  spesific_gender: z.string(),
  en_wellness_package_content: z.string(),
  id_wellness_package_content: z.string(),
  included: z.array(z.string()),
  vendor_id: z.string(),
  hotel_id: z.string().optional(),
  real_price: z.number(),
  discount_price: z.number(),
  status: z.string(),
});

export const MedicalSchema = z.object({
  en_title: z.string().min(3),
  id_title: z.string().min(3),
  en_tagline: z.string().min(3),
  id_tagline: z.string().min(3),
  highlight_image: z.string().min(1),
  reference_image: z.array(z.string().min(1)),
  duration_by_day: z.number(),
  duration_by_night: z.number().optional(),
  spesific_gender: z.string(),
  en_medical_package_content: z.string(),
  id_medical_package_content: z.string(),
  included: z.array(z.string()),
  vendor_id: z.string(),
  hotel_id: z.string().optional(),
  real_price: z.number(),
  discount_price: z.number(),
  status: z.string(),
});

export const PackageSchema = z.object({
  en_title: z.string().min(3),
  id_title: z.string().min(3),
  en_tagline: z.string().min(3),
  id_tagline: z.string().min(3),
  highlight_image: z.string().min(1),
  reference_image: z.array(z.string().min(1)),
  duration_by_day: z.number(),
  duration_by_night: z.number().optional(),
  spesific_gender: z.string(),
  en_wellness_package_content: z.string(),
  id_wellness_package_content: z.string(),
  en_medical_package_content: z.string(),
  id_medical_package_content: z.string(),
  en_detail: z.string(),
  id_detail: z.string(),
  included: z.array(z.string()),
  vendor_id: z.string(),
  hotel_id: z.string(),
  real_price: z.number(),
  discount_price: z.number(),
  status: z.string(),
});

export const EquipmentSchema = z.object({
  en_title: z.string().min(3),
  id_title: z.string().min(3),
  spesific_gender: z.string(),
  highlight_image: z.string().min(1),
  reference_image: z.array(z.string().min(1)),
  en_description: z.string(),
  id_description: z.string(),
  vendor_id: z.string().min(1),
  real_price: z.number(),
  discount_price: z.number(),
  status: z.string(),
});

export const EventSchema = z.object({
  en_title: z.string().min(3),
  id_title: z.string().min(3),
  highlight_image: z.string().min(1),
  reference_image: z.array(z.string().min(1)),
  en_description: z.string(),
  id_description: z.string(),
  organized_image: z.string(),
  organized_by: z.string(),
  start_date: z.date(),
  end_date: z.date(),
  location_name: z.string(),
  location_map: z.string(),
  registration_url: z.url().optional(),
  status: z.string(),
});

export const ArticleAuthorSchema = z.object({
  name: z.string().min(1),
  jobdesc: z.string().min(3),
  profile_image: z.string().min(1),
});

export const ArticleCategorySchema = z.object({
  id_category: z.string().min(1),
  en_category: z.string().min(1),
  id_description: z.string().optional(),
  en_description: z.string().optional(),
});

export const ArticleSchema = z.object({
  en_title: z.string().min(3),
  id_title: z.string().min(3),
  highlight_image: z.string().min(1),
  author: z.array(z.string().min(1)),
  category: z.array(z.string().min(1)),
  en_content: z.string(),
  id_content: z.string(),
  status: z.string(),
});

export const HeroSchema = z.object({
  title: z.string().min(3),
  image: z.string().min(1),
  link: z.url(), // Seharusnya link bisa nullable atau optional
  display_order: z.string(),
  is_active: z.boolean(),
});

export const LegalSchema = z.object({
  en_title: z.string().min(3),
  id_title: z.string().min(3),
  en_content: z.string(),
  id_content: z.string(),
});

export const contactSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.email("Invalid email address"),
  phone_number: z.string().min(5, "Invalid phone number"),
  message: z.string().min(3, "Message is required"),
  subject: z.string().min(1, "Subject is required"),
});

export const DoctorSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(5),
  license_number: z.string().min(1),
  specialty: z.array(z.string().min(1)),
  en_bio: z.string().min(1),
  id_bio: z.string().min(1),
  photo_url: z.string().min(1),
  is_available: z.boolean(),
  status: z.string(),
});
