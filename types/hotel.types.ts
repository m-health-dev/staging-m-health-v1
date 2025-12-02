export type HotelType = {
  id: string;
  slug: string;
  created_at: Date;
  updated_at: Date;
  name: string;
  en_description: string;
  id_description: string;
  logo: string;
  highlight_image: string;
  reference_image: string[];
  location_map: string;
};
