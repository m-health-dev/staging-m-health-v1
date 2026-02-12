import { z } from "zod";

import { parsePhoneNumberFromString } from "libphonenumber-js";
import { title } from "node:process";
import { ms } from "date-fns/locale";

type Locale = "id" | "en";

const errorMessages = {
  // Common
  phone_invalid: {
    id: "Nomor telepon tidak valid",
    en: "Invalid phone number",
  },
  email_invalid: {
    id: "Format email tidak valid",
    en: "Invalid email format",
  },
  email_required: {
    id: "Email wajib diisi",
    en: "Email is required",
  },
  password_min_8: {
    id: "Password harus berisi setidaknya 8 karakter",
    en: "Password must be at least 8 characters",
  },
  password_strong: {
    id: "Gunakan setidaknya 8 karakter dengan huruf besar, huruf kecil, angka, dan karakter spesial",
    en: "Use at least 8 characters with uppercase, lowercase, numbers, and special characters",
  },
  fullname_required: {
    id: "Nama lengkap wajib diisi",
    en: "Full name is required",
  },
  fullname_min_3: {
    id: "Nama lengkap minimal 3 karakter",
    en: "Full name must be at least 3 characters",
  },
  otp_required: {
    id: "Kode OTP wajib diisi dan harus 6 karakter",
    en: "OTP is required and must be 6 characters",
  },
  otp_min_6: {
    id: "Kode OTP harus 6 karakter",
    en: "OTP must be 6 characters",
  },
  redirect_required: {
    id: "Redirect wajib diisi",
    en: "Redirect is required",
  },

  // Vendor
  name_min_3: {
    id: "Nama minimal 3 karakter",
    en: "Name must be at least 3 characters",
  },
  name_min_1: {
    id: "Nama wajib diisi",
    en: "Name is required",
  },
  description_en_min_3: {
    id: "Deskripsi (EN) minimal 3 karakter",
    en: "Description (EN) must be at least 3 characters",
  },
  description_id_min_3: {
    id: "Deskripsi (ID) minimal 3 karakter",
    en: "Description (ID) must be at least 3 characters",
  },
  category_min_3: {
    id: "Kategori minimal 3 karakter",
    en: "Category must be at least 3 characters",
  },
  category_min_1: {
    id: "Kategori wajib diisi",
    en: "Category is required",
  },
  specialist_required: {
    id: "Spesialisasi wajib diisi",
    en: "Specialist is required",
  },
  specialist_min_1: {
    id: "Minimal 1 spesialisasi diperlukan",
    en: "At least 1 specialist is required",
  },
  logo_required: {
    id: "Logo wajib diisi",
    en: "Logo is required",
  },
  highlight_image_required: {
    id: "Gambar utama wajib diisi",
    en: "Highlight image is required",
  },
  reference_image_min_1: {
    id: "Minimal 1 gambar referensi diperlukan",
    en: "At least 1 reference image is required",
  },
  location_map_invalid: {
    id: "URL lokasi peta tidak valid",
    en: "Invalid location map URL",
  },
  location_required: {
    id: "Lokasi wajib diisi",
    en: "Location is required",
  },
  insurance_required: {
    id: "Asuransi wajib diisi",
    en: "Insurance is required",
  },

  // Insurance
  agent_name_required: {
    id: "Nama agen wajib diisi",
    en: "Agent name is required",
  },
  agent_number_min_5: {
    id: "Nomor agen minimal 5 karakter",
    en: "Agent number must be at least 5 characters",
  },
  agent_photo_required: {
    id: "Foto agen wajib diisi",
    en: "Agent photo is required",
  },

  // Wellness & Medical & Package
  title_en_min_3: {
    id: "Judul (EN) minimal 3 karakter",
    en: "Title (EN) must be at least 3 characters",
  },
  title_id_min_3: {
    id: "Judul (ID) minimal 3 karakter",
    en: "Title (ID) must be at least 3 characters",
  },
  tagline_en_min_3: {
    id: "Tagline (EN) minimal 3 karakter",
    en: "Tagline (EN) must be at least 3 characters",
  },
  tagline_id_min_3: {
    id: "Tagline (ID) minimal 3 karakter",
    en: "Tagline (ID) must be at least 3 characters",
  },
  duration_day_required: {
    id: "Durasi hari wajib diisi",
    en: "Duration by day is required",
  },
  gender_required: {
    id: "Jenis kelamin wajib diisi",
    en: "Gender is required",
  },
  gender_min_3: {
    id: "Jenis kelamin minimal 3 karakter",
    en: "Gender must be at least 3 characters",
  },
  wellness_content_en_required: {
    id: "Konten wellness (EN) wajib diisi",
    en: "Wellness content (EN) is required",
  },
  wellness_content_id_required: {
    id: "Konten wellness (ID) wajib diisi",
    en: "Wellness content (ID) is required",
  },
  wellness_content_en_min_3: {
    id: "Konten wellness (EN) minimal 3 karakter",
    en: "Wellness content (EN) must be at least 3 characters",
  },
  wellness_content_id_min_3: {
    id: "Konten wellness (ID) minimal 3 karakter",
    en: "Wellness content (ID) must be at least 3 characters",
  },
  medical_content_en_required: {
    id: "Konten medis (EN) wajib diisi",
    en: "Medical content (EN) is required",
  },
  medical_content_id_required: {
    id: "Konten medis (ID) wajib diisi",
    en: "Medical content (ID) is required",
  },
  medical_content_en_min_3: {
    id: "Konten medis (EN) minimal 3 karakter",
    en: "Medical content (EN) must be at least 3 characters",
  },
  medical_content_id_min_3: {
    id: "Konten medis (ID) minimal 3 karakter",
    en: "Medical content (ID) must be at least 3 characters",
  },
  detail_en_min_3: {
    id: "Detail (EN) minimal 3 karakter",
    en: "Detail (EN) must be at least 3 characters",
  },
  detail_id_min_3: {
    id: "Detail (ID) minimal 3 karakter",
    en: "Detail (ID) must be at least 3 characters",
  },
  included_required: {
    id: "Item yang termasuk wajib diisi",
    en: "Included items are required",
  },
  vendor_id_required: {
    id: "Vendor wajib dipilih",
    en: "Vendor is required",
  },
  hotel_id_required: {
    id: "Hotel wajib dipilih",
    en: "Hotel is required",
  },
  vendor_id_min_3: {
    id: "Vendor ID minimal 3 karakter",
    en: "Vendor ID must be at least 3 characters",
  },
  hotel_id_min_3: {
    id: "Hotel ID minimal 3 karakter",
    en: "Hotel ID must be at least 3 characters",
  },
  real_price_required: {
    id: "Harga asli wajib diisi",
    en: "Real price is required",
  },
  real_price_min_1000: {
    id: "Harga asli minimal 1000",
    en: "Real price must be at least 1000",
  },
  discount_price_required: {
    id: "Harga diskon wajib diisi",
    en: "Discount price is required",
  },
  status_required: {
    id: "Status wajib diisi",
    en: "Status is required",
  },
  status_min_3: {
    id: "Status minimal 3 karakter",
    en: "Status must be at least 3 characters",
  },

  // Event
  organized_image_required: {
    id: "Gambar penyelenggara wajib diisi",
    en: "Organizer image is required",
  },
  organized_by_required: {
    id: "Penyelenggara wajib diisi",
    en: "Organized by is required",
  },
  start_date_required: {
    id: "Tanggal mulai wajib diisi",
    en: "Start date is required",
  },
  end_date_required: {
    id: "Tanggal selesai wajib diisi",
    en: "End date is required",
  },
  location_name_required: {
    id: "Nama lokasi wajib diisi",
    en: "Location name is required",
  },
  location_map_required: {
    id: "Link Peta lokasi wajib diisi",
    en: "Location map link is required",
  },
  registration_url_invalid: {
    id: "URL registrasi tidak valid",
    en: "Invalid registration URL",
  },

  // Article
  jobdesc_min_3: {
    id: "Deskripsi pekerjaan minimal 3 karakter",
    en: "Job description must be at least 3 characters",
  },
  profile_image_required: {
    id: "Foto profil wajib diisi",
    en: "Profile image is required",
  },
  category_en_required: {
    id: "Kategori (EN) wajib diisi",
    en: "Category (EN) is required",
  },
  category_id_required: {
    id: "Kategori (ID) wajib diisi",
    en: "Category (ID) is required",
  },
  author_min_1: {
    id: "Minimal 1 penulis diperlukan",
    en: "At least 1 author is required",
  },
  content_en_required: {
    id: "Konten (EN) wajib diisi",
    en: "Content (EN) is required",
  },
  content_id_required: {
    id: "Konten (ID) wajib diisi",
    en: "Content (ID) is required",
  },

  // Hero
  title_min_3: {
    id: "Judul minimal 3 karakter",
    en: "Title must be at least 3 characters",
  },
  image_required: {
    id: "Gambar wajib diisi",
    en: "Image is required",
  },
  link_invalid: {
    id: "URL link tidak valid",
    en: "Invalid link URL",
  },
  display_order_required: {
    id: "Urutan tampilan wajib diisi",
    en: "Display order is required",
  },
  is_active_required: {
    id: "Status aktif wajib diisi",
    en: "Active status is required",
  },

  // Contact
  message_min_3: {
    id: "Pesan minimal 3 karakter",
    en: "Message must be at least 3 characters",
  },
  subject_required: {
    id: "Subjek wajib diisi",
    en: "Subject is required",
  },

  // Doctor
  license_number_required: {
    id: "Nomor lisensi wajib diisi",
    en: "License number is required",
  },
  bio_en_required: {
    id: "Bio (EN) wajib diisi",
    en: "Bio (EN) is required",
  },
  bio_id_required: {
    id: "Bio (ID) wajib diisi",
    en: "Bio (ID) is required",
  },

  specialty_required: {
    id: "Spesialisasi wajib diisi",
    en: "Specialty is required",
  },
  photo_url_required: {
    id: "URL foto wajib diisi",
    en: "Photo URL is required",
  },
  is_available_required: {
    id: "Status ketersediaan wajib diisi",
    en: "Availability status is required",
  },
} as const;

// Helper function to get error message based on locale
export const getErrorMessage = (
  key: keyof typeof errorMessages,
  locale: Locale = "id",
): string => {
  return errorMessages[key][locale];
};

export const createZodSchemas = (locale: Locale = "id") => {
  const msg = (key: keyof typeof errorMessages) => errorMessages[key][locale];

  const phoneSchema = z.string().refine((val) => {
    const cleaned = val.replace(/\D/g, "");
    const phone = parsePhoneNumberFromString(cleaned);
    return phone?.isValid();
  }, msg("phone_invalid"));

  const emailSchema = z.email(msg("email_invalid"));

  const AuthSignInSchema = z.object({
    email: z.email(msg("email_invalid")),
    password: z
      .string()
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_])[A-Za-z\d\W_]{8,}$/, {
        message: msg("password_strong"),
      }),
    redirect: z.string(),
  });

  const AuthSignUpSchema = z.object({
    fullname: z.string().min(3, msg("fullname_min_3")),
    email: z.email(msg("email_invalid")),
    password: z.string().min(8, msg("password_min_8")),
  });

  const ForgotPassSchema = z.object({
    email: z.email(msg("email_invalid")),
  });

  const resetPasswordSchema = z.object({
    password: z
      .string()
      .min(8, {
        message: msg("password_min_8"),
      })
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_])[A-Za-z\d\W_]{8,}$/, {
        message: msg("password_strong"),
      }),
    confirmPassword: z
      .string()
      .min(8, {
        message: msg("password_min_8"),
      })
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_])[A-Za-z\d\W_]{8,}$/, {
        message: msg("password_strong"),
      }),
  });

  const OTPSignInSchema = z.object({
    email: z.email(msg("email_invalid")),
    otp: z.string().min(6, msg("otp_min_6")),
  });

  const RequestOTPSchema = z.object({
    email: z.email(msg("email_invalid")),
  });

  const VerifyOTPSchema = z.object({
    email: z.email(msg("email_invalid")),
    otp: z.string().min(6, msg("otp_min_6")),
  });

  const VendorSchema = z.object({
    name: z.string().min(3, msg("name_min_3")),
    en_description: z.string().min(3, msg("description_en_min_3")),
    id_description: z.string().min(3, msg("description_id_min_3")),
    category: z.string().min(3, msg("category_min_3")),
    specialist: z.array(z.string()).min(1, msg("specialist_min_1")),
    logo: z.string().min(1, msg("logo_required")),
    highlight_image: z.string().min(1, msg("highlight_image_required")),
    reference_image: z.array(z.string()).min(1, msg("reference_image_min_1")),
    location_map: z.url().min(1, msg("location_map_invalid")),
    location: z.string().min(1, msg("location_required")),
    insurance_id: z.array(z.string()).optional(),
  });

  const InsuranceSchema = z.object({
    name: z.string().min(3, msg("name_min_3")),
    en_description: z.string().min(3, msg("description_en_min_3")),
    id_description: z.string().min(3, msg("description_id_min_3")),
    category: z.array(z.string()).min(1, msg("category_min_1")),
    specialist: z.array(z.string()).min(1, msg("specialist_min_1")),
    logo: z.string().min(1, msg("logo_required")),
    highlight_image: z.string().min(1, msg("highlight_image_required")),
    agent_name: z.string().min(1, msg("agent_name_required")),
    agent_number: z.string().min(5, msg("agent_number_min_5")),
    agent_photo_url: z.string().min(1, msg("agent_photo_required")),
  });

  const HotelSchema = z.object({
    name: z.string().min(3, msg("name_min_3")),
    en_description: z.string().min(3, msg("description_en_min_3")),
    id_description: z.string().min(3, msg("description_id_min_3")),
    logo: z.string().min(1, msg("logo_required")),
    highlight_image: z.string().min(1, msg("highlight_image_required")),
    reference_image: z.array(z.string().min(1, msg("reference_image_min_1"))),
    location_map: z.url().min(1, msg("location_map_invalid")),
    location: z.string().min(1, msg("location_required")),
  });

  const WellnessSchema = z.object({
    en_title: z.string().min(3, msg("title_en_min_3")),
    id_title: z.string().min(3, msg("title_id_min_3")),
    en_tagline: z.string().min(3, msg("tagline_en_min_3")),
    id_tagline: z.string().min(3, msg("tagline_id_min_3")),
    highlight_image: z.string().min(1, msg("highlight_image_required")),
    reference_image: z.array(z.string().min(1, msg("reference_image_min_1"))),
    duration_by_day: z.number().min(1, msg("duration_day_required")),
    duration_by_night: z.number().optional(),
    spesific_gender: z.string().min(3, msg("gender_required")),
    en_wellness_package_content: z
      .string()
      .min(3, msg("wellness_content_en_min_3")),
    id_wellness_package_content: z
      .string()
      .min(3, msg("wellness_content_id_min_3")),
    included: z.array(z.string()).min(1, msg("included_required")),
    vendor_id: z.string().min(3, msg("vendor_id_required")),
    hotel_id: z.string().optional(),
    real_price: z.number().min(1000, msg("real_price_min_1000")),
    discount_price: z.number(),
    status: z.string().min(3, msg("status_required")),
  });

  const MedicalSchema = z.object({
    en_title: z.string().min(3, msg("title_en_min_3")),
    id_title: z.string().min(3, msg("title_id_min_3")),
    en_tagline: z.string().min(3, msg("tagline_en_min_3")),
    id_tagline: z.string().min(3, msg("tagline_id_min_3")),
    highlight_image: z.string().min(1, msg("highlight_image_required")),
    reference_image: z.array(z.string().min(1, msg("reference_image_min_1"))),
    duration_by_day: z.number().min(1, msg("duration_day_required")),
    duration_by_night: z.number().optional(),
    spesific_gender: z.string().min(3, msg("gender_required")),
    en_medical_package_content: z
      .string()
      .min(3, msg("medical_content_en_min_3")),
    id_medical_package_content: z
      .string()
      .min(3, msg("medical_content_id_min_3")),
    included: z.array(z.string()).min(1, msg("included_required")),
    vendor_id: z.string().min(3, msg("vendor_id_required")),
    hotel_id: z.string().optional(),
    real_price: z.number().min(1000, msg("real_price_min_1000")),
    discount_price: z.number(),
    status: z.string().min(3, msg("status_required")),
  });

  const PackageSchema = z.object({
    en_title: z.string().min(3, msg("title_en_min_3")),
    id_title: z.string().min(3, msg("title_id_min_3")),
    en_tagline: z.string().min(3, msg("tagline_en_min_3")),
    id_tagline: z.string().min(3, msg("tagline_id_min_3")),
    highlight_image: z.string().min(1, msg("highlight_image_required")),
    reference_image: z.array(z.string().min(1, msg("reference_image_min_1"))),
    duration_by_day: z.number().min(1, msg("duration_day_required")),
    duration_by_night: z.number().optional(),
    spesific_gender: z.string().min(3, msg("gender_required")),
    en_wellness_package_content: z
      .string()
      .min(3, msg("wellness_content_en_min_3")),
    id_wellness_package_content: z
      .string()
      .min(3, msg("wellness_content_id_min_3")),
    en_medical_package_content: z
      .string()
      .min(3, msg("medical_content_en_min_3")),
    id_medical_package_content: z
      .string()
      .min(3, msg("medical_content_id_min_3")),
    en_detail: z.string().min(3, msg("detail_en_min_3")),
    id_detail: z.string().min(3, msg("detail_id_min_3")),
    included: z.array(z.string()).min(1, msg("included_required")),
    vendor_id: z.string().min(3, msg("vendor_id_required")),
    hotel_id: z.string().min(3, msg("hotel_id_required")),
    real_price: z.number().min(1000, msg("real_price_min_1000")),
    discount_price: z.number(),
    status: z.string().min(3, msg("status_required")),
  });

  const EquipmentSchema = z.object({
    en_title: z.string().min(3, msg("title_en_min_3")),
    id_title: z.string().min(3, msg("title_id_min_3")),
    spesific_gender: z.string().min(3, msg("gender_required")),
    highlight_image: z.string().min(1, msg("highlight_image_required")),
    reference_image: z.array(z.string().min(1, msg("reference_image_min_1"))),
    en_description: z.string().min(3, msg("description_en_min_3")),
    id_description: z.string().min(3, msg("description_id_min_3")),
    vendor_id: z.string().min(1, msg("vendor_id_required")),
    real_price: z.number().min(1000, msg("real_price_min_1000")),
    discount_price: z.number(),
    status: z.string().min(3, msg("status_required")),
  });

  const EventSchema = z.object({
    en_title: z.string().min(3, msg("title_en_min_3")),
    id_title: z.string().min(3, msg("title_id_min_3")),
    highlight_image: z.string().min(1, msg("highlight_image_required")),
    reference_image: z.array(z.string().min(1, msg("reference_image_min_1"))),
    en_description: z.string().min(3, msg("description_en_min_3")),
    id_description: z.string().min(3, msg("description_id_min_3")),
    organized_image: z.string().min(1, msg("organized_image_required")),
    organized_by: z.string().min(1, msg("organized_by_required")),
    start_date: z.date(msg("start_date_required")),
    end_date: z.date(msg("end_date_required")),
    location_name: z.string().min(1, msg("location_name_required")),
    location_map: z.string().min(1, msg("location_map_required")),
    registration_url: z.string().optional(), // Seharusnya registration_url bisa nullable atau optional
    status: z.string().min(3, msg("status_required")),
  });

  const ArticleAuthorSchema = z.object({
    name: z.string().min(1, msg("name_min_1")),
    jobdesc: z.string().min(3, msg("jobdesc_min_3")),
    profile_image: z.string().min(1, msg("profile_image_required")),
  });

  const ArticleCategorySchema = z.object({
    id_category: z.string().min(1, msg("category_id_required")),
    en_category: z.string().min(1, msg("category_en_required")),
    id_description: z.string().optional(),
    en_description: z.string().optional(),
  });

  const ArticleSchema = z.object({
    en_title: z.string().min(3, msg("title_en_min_3")),
    id_title: z.string().min(3, msg("title_id_min_3")),
    highlight_image: z.string().min(1, msg("highlight_image_required")),
    author: z.array(z.string().min(1, msg("author_min_1"))),
    category: z.array(z.string().min(1, msg("category_min_1"))),
    en_content: z.string().min(10, msg("content_en_required")),
    id_content: z.string().min(10, msg("content_id_required")),
    status: z.string().min(3, msg("status_required")),
  });

  const HeroSchema = z.object({
    title: z.string().min(3, msg("title_min_3")),
    image: z.string().min(1, msg("image_required")),
    link: z.string().url().optional().or(z.literal("")), // Seharusnya link bisa nullable atau optional
    display_order: z.string().optional(),
    is_active: z.boolean(),
  });

  const LegalSchema = z.object({
    en_title: z.string().min(3, msg("title_en_min_3")),
    id_title: z.string().min(3, msg("title_id_min_3")),
    en_content: z.string().min(10, msg("content_en_required")),
    id_content: z.string().min(10, msg("content_id_required")),
  });

  const contactSchema = z.object({
    name: z.string().min(1, msg("name_min_1")),
    email: z.string().email(msg("email_invalid")),
    phone_number: z.string().min(5, msg("phone_invalid")),
    message: z.string().min(3, msg("message_min_3")),
    subject: z.string().min(1, msg("subject_required")),
  });

  const DoctorSchema = z.object({
    name: z.string().min(1, msg("name_min_1")),
    email: z.string().email(msg("email_invalid")),
    phone: z.string().min(5, msg("phone_invalid")),
    license_number: z.string().min(1, msg("license_number_required")),
    specialty: z.array(z.string().min(1, msg("specialty_required"))),
    en_bio: z.string().min(1, msg("content_en_required")),
    id_bio: z.string().min(1, msg("content_id_required")),
    photo_url: z.string().min(1, msg("photo_url_required")),
    is_available: z.boolean(),
    status: z.string().min(3, msg("status_required")),
  });

  const ConsultationPriceSchema = z.object({
    price: z.number().min(1000, msg("real_price_min_1000")),
  });

  return {
    phoneSchema,
    emailSchema,
    AuthSignInSchema,
    AuthSignUpSchema,
    ForgotPassSchema,
    resetPasswordSchema,
    OTPSignInSchema,
    RequestOTPSchema,
    VerifyOTPSchema,
    VendorSchema,
    InsuranceSchema,
    HotelSchema,
    WellnessSchema,
    MedicalSchema,
    PackageSchema,
    EquipmentSchema,
    EventSchema,
    ArticleAuthorSchema,
    ArticleCategorySchema,
    ArticleSchema,
    HeroSchema,
    LegalSchema,
    contactSchema,
    DoctorSchema,
    ConsultationPriceSchema,
  };
};

let defaultSchemas;
if (typeof window !== "undefined" && window.location) {
  defaultSchemas = createZodSchemas(
    window.location.pathname.startsWith("/en") ? "en" : "id",
  );
} else {
  defaultSchemas = createZodSchemas("id");
}

export const phoneSchema = defaultSchemas.phoneSchema;
export const emailSchema = defaultSchemas.emailSchema;
export const AuthSignInSchema = defaultSchemas.AuthSignInSchema;
export const AuthSignUpSchema = defaultSchemas.AuthSignUpSchema;
export const ForgotPassSchema = defaultSchemas.ForgotPassSchema;
export const resetPasswordSchema = defaultSchemas.resetPasswordSchema;
export const OTPSignInSchema = defaultSchemas.OTPSignInSchema;
export const RequestOTPSchema = defaultSchemas.RequestOTPSchema;
export const VerifyOTPSchema = defaultSchemas.VerifyOTPSchema;
export const VendorSchema = defaultSchemas.VendorSchema;
export const InsuranceSchema = defaultSchemas.InsuranceSchema;
export const HotelSchema = defaultSchemas.HotelSchema;
export const WellnessSchema = defaultSchemas.WellnessSchema;
export const MedicalSchema = defaultSchemas.MedicalSchema;
export const PackageSchema = defaultSchemas.PackageSchema;
export const EquipmentSchema = defaultSchemas.EquipmentSchema;
export const EventSchema = defaultSchemas.EventSchema;
export const ArticleAuthorSchema = defaultSchemas.ArticleAuthorSchema;
export const ArticleCategorySchema = defaultSchemas.ArticleCategorySchema;
export const ArticleSchema = defaultSchemas.ArticleSchema;
export const HeroSchema = defaultSchemas.HeroSchema;
export const LegalSchema = defaultSchemas.LegalSchema;
export const contactSchema = defaultSchemas.contactSchema;
export const DoctorSchema = defaultSchemas.DoctorSchema;
export const ConsultationPriceSchema = defaultSchemas.ConsultationPriceSchema;

// Export error messages for external use if needed
export { errorMessages };
export type { Locale };
