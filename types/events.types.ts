import { Gender, StatusContent } from "./enum.types";

export type EventsType = {
  id: string;
  created_at: string;
  updated_at: string;
  slug: string;
  en_title: string;
  id_title: string;
  en_description: string;
  id_description: string;
  highlight_image: string;
  reference_image: string[];
  organized_image: string;
  organized_by: string;
  start_date: Date;
  end_date: Date;
  location_name: string;
  location_map: string;
  registration_url: string;
  status: string;
};
