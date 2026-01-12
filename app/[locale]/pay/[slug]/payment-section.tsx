"use client";

import PaymentActionCard from "@/components/pay/PaymentActionCard";
import { usePaymentFlow } from "@/components/pay/PaymentFlowProvider";

import { Account } from "@/types/account.types";

export type PaymentSectionProps = {
  locale: string;
  payID: string;
  productType: string;
  productId: string;
  discountPrice?: number;
  realPrice: number;
  account: Account | null;
};

const PaymentSection = ({
  locale,
  payID,
  productType,
  productId,
  discountPrice,
  realPrice,
  account,
}: PaymentSectionProps) => {
  const { runBookingSubmit } = usePaymentFlow();

  return (
    <PaymentActionCard
      locale={locale}
      payID={payID}
      productType={productType}
      productId={productId}
      discountPrice={discountPrice}
      realPrice={realPrice}
      account={account}
    />
  );
};

export default PaymentSection;
