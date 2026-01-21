export type VendorType = {
  id: string;
  slug: string;
  created_at: Date;
  updated_at: Date;
  name: string;
  en_description: string;
  id_description: string;
  category: string;
  specialist: string[];
  logo: string;
  highlight_image: string;
  reference_image: string[];
  location_map: string;
  location: string;
  insurance_id: string[];
};
