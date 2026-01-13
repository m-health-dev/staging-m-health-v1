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
};
