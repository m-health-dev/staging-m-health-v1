export type InsuranceType = {
  id: string;
  slug: string;
  created_at: Date;
  updated_at: Date;
  name: string;
  en_description: string;
  id_description: string;
  category: string[];
  specialist: string[];
  highlight_image: string;
  logo: string;
  agent_name: string;
  agent_number: string;
  agent_photo_url: string;
};
