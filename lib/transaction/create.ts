import { v4 as uuidv4 } from "uuid";
import snap from "./init";

export type CustomerDetails = {
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
};

export type ItemDetail = {
  id: string;
  price: number;
  quantity: number;
  name: string;
};

export type TransactionInput = {
  orderId?: string;
  grossAmount: number;
  itemDetails?: ItemDetail[];
  customerDetails?: CustomerDetails;
  callbacks?: {
    finish?: string;
    pending?: string;
    error?: string;
  };
};

export type TransactionResult = {
  orderId: string;
  token: string;
  redirectUrl: string;
};

const createTransaction = async (
  payload: TransactionInput
): Promise<TransactionResult> => {
  const orderId = payload.orderId ?? `order-${uuidv4()}`;

  const transactionParams = {
    transaction_details: {
      order_id: orderId,
      gross_amount: payload.grossAmount,
    },
    item_details: payload.itemDetails,
    customer_details: payload.customerDetails,
    credit_card: { secure: true },
    callbacks: payload.callbacks,
  };

  const transaction = await snap.createTransaction(transactionParams);

  return {
    orderId,
    token: transaction.token,
    redirectUrl: transaction.redirect_url,
  };
};

export default createTransaction;
