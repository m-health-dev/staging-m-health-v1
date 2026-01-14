export type TransactionType = {
  id: string;
  transaction_id: string;
  user_id: string;
  fullname: string;
  email: string;
  phone: string;
  address: string;
  payment_status: string;
  product_data: {
    id: string;
    tax: number;
    name: string;
    type: string;
    price: number;
    total: number;
  };
  user: {
    id: string;
    fullname: string;
    email: string;
  };
  created_at: string;
  updated_at: string;
};
