export type Account = {
  id: string;
  created_at: string;
  updated_at: string;
  email: string;
  fullname: string;
  phone: number;
  gender: string;
  domicile: JSON;
  height: number;
  weight: number;
  avatar_url: string;
  birthdate: Date;
  google_fullname: string;
  google_avatar: string;
};
