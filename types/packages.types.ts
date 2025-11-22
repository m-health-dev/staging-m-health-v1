export type Package = {
  id: string;
  created_at: string;
  updated_at: string;
  title: string;
  description: string;
  tagline: string;
  highlight_image: string | null;
  reference_image: string | null;
  duration_by_day: number;
  duration_by_night: number;
  is_medical: boolean;
  is_entertain: boolean;
  medical_package: {
    day: number;
    target_steps: number;
    health_check: string;
    route: string;
  };
  entertain_package: {
    route: string;
    activity: string;
    location: string;
  };
  included: string[];
  hotel_name: string | null;
  hotel_map: string | null;
  hospital_name: string | null;
  hospital_map: string | null;
  spesific_gender: "Unisex" | "Male" | "Female";
  price: number;
};
