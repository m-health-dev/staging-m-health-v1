import { Gender, StatusContent } from "./enum.types";

export type MedicalType = {
  id: string;
  created_at: string;
  updated_at: string;
  slug: string;
  en_title: string;
  id_title: string;
  en_tagline: string;
  id_tagline: string;
  highlight_image: string;
  reference_image: string[];
  duration_by_day: number;
  duration_by_night: number;
  spesific_gender: Gender;
  en_medical_package_content: string;
  id_medical_package_content: string;
  included: string[];
  vendor_id: string;
  hotel_id: string;
  real_price: number;
  discount_price: number;
  status: StatusContent;
};
