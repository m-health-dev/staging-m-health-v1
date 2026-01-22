import ContainerWrap from "@/components/utility/ContainerWrap";
import Wrapper from "@/components/utility/Wrapper";
import { routing } from "@/i18n/routing";
import { getLocale } from "next-intl/server";
import React from "react";

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

// ?order_id=ORD-WEL-1768140857-j8rppe&status_code=200&transaction_status=settlement

const FailedPayment = async ({ searchParams }: Props) => {
  const search = await searchParams;
  const order_id = search.order_id as string;
  const status_code = search.status_code as string;
  const transaction_status = search.transaction_status as string;
  const locale = await getLocale();
  
  return (
    <Wrapper>
      <ContainerWrap className="my-20">
        <div className="text-center">
          <h1 className="text-3xl font-semibold mb-4">
            {locale === routing.defaultLocale ? "Pembayaran Gagal" : "Payment Failed"}
          </h1>
          <p className="mb-2">Order ID: {order_id}</p>
          <p className="mb-2">
            {locale === routing.defaultLocale ? "Kode Status" : "Status Code"}: {status_code}
          </p>
          <p className="mb-2">
            {locale === routing.defaultLocale ? "Status Transaksi" : "Transaction Status"}: {transaction_status}
          </p>
          <p className="mt-4">
            {locale === routing.defaultLocale
              ? "Maaf, pembayaran Anda gagal. Silakan coba lagi atau hubungi layanan pelanggan untuk bantuan."
              : "Sorry, your payment failed. Please try again or contact customer service for assistance."}
          </p>
        </div>
      </ContainerWrap>
    </Wrapper>
  );
};

export default FailedPayment;
