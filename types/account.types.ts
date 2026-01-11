export type Account = {
  id: string;
  created_at: string;
  updated_at: string;
  email: string;
  fullname: string;
  phone: number;
  gender: string;
  domicile: {
    address?: string;
    city?: string;
    district?: string;
    postal_code?: string;
  };
  height: number;
  weight: number;
  avatar_url: string;
  birthdate: Date;
  google_fullname: string;
  google_avatar: string;
};

export type UsersType = {
  id: string;
  email: string;
  fullname: string;
  phone: string;
  gender: string;
  domicile: JSON;
  height: number;
  weight: number;
  avatar_url: string;
  birthdate: Date;
  created_at: string;
  updated_at: string;
};
