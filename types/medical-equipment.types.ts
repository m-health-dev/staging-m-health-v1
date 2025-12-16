import { Gender, StatusContent } from "./enum.types";

export type MedicalEquipmentType = {
  id: string;
  created_at: string;
  updated_at: string;
  slug: string;
  en_title: string;
  id_title: string;
  spesific_gender: string;
  highlight_image: string;
  reference_image: string[];
  en_description: string;
  id_description: string;
  vendor_id: string;
  real_price: number;
  discount_price: number;
  status: string;
};
