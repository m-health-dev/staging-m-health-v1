import { Account } from "./account.types";

export type ConsultScheduleType = {
  id: string;
  user_id: string;
  created_at: string;
  updated_at: string;
  fullname: string;
  complaint: string;
  date_of_birth: string;
  height: number;
  weight: number;
  gender: string;
  scheduled_datetime: string;
  email: string;
  phone_number: string;
  reference_image: any[];
  payment_status: string;
  chat_session: string;
  location: {
    city: string;
    address: string;
    district: string;
    postal_code: string;
  };
  reservation_expires_at: string;
  user: Account;
  doctor_id: string;
  user_email_status: string;
  user_wa_status: string;
  doctor_email_status: string;
  doctor_wa_status: string;
  meeting_link: string;
};

export type DoctorType = {
  id: string;
  created_at: string;
  updated_at: string;
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
};
