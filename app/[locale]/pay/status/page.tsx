import ContainerWrap from "@/components/utility/ContainerWrap";
import Wrapper from "@/components/utility/Wrapper";
import { getMedicalEquipmentByID } from "@/lib/medical-equipment/get-medical-equipment";
import { getMedicalByID } from "@/lib/medical/get-medical";
import { getPackageByID } from "@/lib/packages/get-packages";
import { getPaymentsByOrderID } from "@/lib/transaction/get-payments-data";
import { getWellnessByID } from "@/lib/wellness/get-wellness";
import { getLocale, getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import React from "react";
import Image from "next/image";
import { Mars, Venus, VenusAndMars } from "lucide-react";
import AvatarVendorHotel from "@/components/utility/AvatarVendorHotel";
import { calculateDiscount } from "@/components/utility/PriceInfo";
import { formatRupiah } from "@/helper/rupiah";
import { cn } from "@/lib/utils";
import TransactionStatusClient from "./transaction-status-client";
import { getConsultationByID } from "@/lib/consult/get-consultation";

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

// ?order_id=ORD-WEL-1768140857-j8rppe&status_code=200&transaction_status=settlement

const SuccessPayment = async ({ searchParams }: Props) => {
  const search = await searchParams;
  const order_id = search.order_id as string;
  const status_code = search.status_code as string;
  const transaction_status = search.transaction_status as string;

  const { data } = await getPaymentsByOrderID(order_id);
  const locale = await getLocale();

  const t = await getTranslations("utility");

  if (!order_id || !data) {
    return notFound();
  }

  const productType = data.product_data.type as string;
  const productId = data.product_data.id as string;

  let dataProduct = null;
  let productTypeTitle = "";

  if (!productId || !productType) {
    return notFound();
  }

  if (productType === "package") {
    dataProduct = (await getPackageByID(productId as string)).data;
    productTypeTitle = locale === "id" ? "Paket" : "Package";
  } else if (productType === "medical_equipment") {
    dataProduct = (await getMedicalEquipmentByID(productId as string)).data
      .data;
    productTypeTitle =
      locale === "id" ? "Peralatan Medis" : "Medical Equipment";
  } else if (productType === "medical") {
    dataProduct = (await getMedicalByID(productId as string)).data.data;
    productTypeTitle = locale === "id" ? "Paket Medis" : "Medical Package";
  } else if (productType === "wellness") {
    dataProduct = (await getWellnessByID(productId as string)).data.data;
    productTypeTitle = locale === "id" ? "Paket Kebugaran" : "Wellness Package";
  } else if (productType === "consultation") {
    dataProduct = (await getConsultationByID(productId as string)).data;
    productTypeTitle = locale === "id" ? "Konsultasi" : "Consultation";
  }

  if (!dataProduct) {
    return notFound();
  }
  return (
    <Wrapper>
      <TransactionStatusClient
        order_id={order_id}
        status_code={status_code}
        transaction_status={transaction_status}
        locale={locale}
        dataProduct={dataProduct}
        productType={productType}
        productTypeTitle={productTypeTitle}
        labels={{
          male: t("male"),
          female: t("female"),
          unisex: t("unisex"),
        }}
      />
    </Wrapper>
  );
};

export default SuccessPayment;
