export type DoctorType = {
  id: string;
  slug: string;
  name: string;
  email: string;
  phone: string;
  license_number: string;
  specialty: string[];
  en_bio: string;
  id_bio: string;
  photo_url: string;
  is_available: boolean;
  status: string;
  created_at: string;
  updated_at: string;
};
