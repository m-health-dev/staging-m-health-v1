import TransactionStatusClient from "@/app/[locale]/pay/status/transaction-status-client";
import AvatarUser from "@/components/utility/AvatarUser";
import ContainerWrap from "@/components/utility/ContainerWrap";
import { routing } from "@/i18n/routing";
import { getConsultationByID } from "@/lib/consult/get-consultation";
import { getMedicalEquipmentByID } from "@/lib/medical-equipment/get-medical-equipment";
import { getMedicalByID } from "@/lib/medical/get-medical";
import { getPackageByID } from "@/lib/packages/get-packages";
import { getPaymentsByOrderID } from "@/lib/transaction/get-payments-data";
import { getWellnessByID } from "@/lib/wellness/get-wellness";
import { getLocale, getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import React from "react";
import TransactionStatusClientAdmin from "./transaction-client-admin";
import { formatRupiah } from "@/helper/rupiah";

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

const TransactionDetailAdmin = async ({ params }: Props) => {
  const { id } = await params;

  const data = (await getPaymentsByOrderID(id)).data.data;
  const locale = await getLocale();
  const t = await getTranslations("utility");

  const productType = data.product_data.type as string;
  const productId = data.product_data.id as string;

  let dataProduct = null;
  let productTypeTitle = "";

  if (!productId || !productType) {
    return notFound();
  }

  try {
    if (productType === "package") {
      const res = await getPackageByID(productId as string);
      dataProduct = res?.data ?? null;
      productTypeTitle = locale === "id" ? "Paket" : "Package";
    } else if (productType === "medical_equipment") {
      const res = await getMedicalEquipmentByID(productId as string);
      dataProduct = res?.data?.data ?? null;
      productTypeTitle =
        locale === "id" ? "Peralatan Medis" : "Medical Equipment";
    } else if (productType === "medical") {
      const res = await getMedicalByID(productId as string);
      dataProduct = res?.data?.data ?? null;
      productTypeTitle = locale === "id" ? "Paket Medis" : "Medical Package";
    } else if (productType === "wellness") {
      const res = await getWellnessByID(productId as string);
      dataProduct = res?.data?.data ?? null;
      productTypeTitle =
        locale === "id" ? "Paket Kebugaran" : "Wellness Package";
    } else if (productType === "consultation") {
      const res = await getConsultationByID(productId as string);
      dataProduct = res?.data ?? null;
      productTypeTitle = locale === "id" ? "Konsultasi" : "Consultation";
    }
  } catch (err) {
    // API error → tetap aman tanpa 500
    dataProduct = null;
  }

  return (
    <ContainerWrap>
      <div className="my-10">
        <div className="inline-flex mb-2">
          <p className="bg-gray-50 text-sm! border border-gray-500 text-gray-800 px-3 py-1 rounded-full">
            {data.order_id}
          </p>
        </div>
        <h3 className="text-primary font-bold">Transaction Detail</h3>
        <div className="inline-flex mt-2">
          {data.payment_status === "settlement" ? (
            <p className="bg-green-50 border border-green-500 px-3 py-1 rounded-full capitalize text-green-500">
              {data.payment_status}
            </p>
          ) : data.payment_status === "pending" ? (
            <p className="bg-amber-50 border border-amber-500 px-3 py-1 rounded-full capitalize text-amber-500">
              {data.payment_status}
            </p>
          ) : (
            <p className="bg-red-50 border border-red-500 px-3 py-1 rounded-full capitalize text-red-500">
              {data.payment_status}
            </p>
          )}
        </div>
      </div>

      <div className="space-y-5">
        <div>
          <p className="text-muted-foreground text-sm! mb-2">
            {locale === routing.defaultLocale ? "Pembeli" : "Buyer"}
          </p>
          <AvatarUser user={data.user.id} locale={locale} size="md" />
        </div>
        <div>
          <p className="text-muted-foreground mb-2">
            {locale === "id" ? "Total Pembayaran" : "Total Payment"}
          </p>
          <h4 className="text-primary font-bold">
            {formatRupiah(data.product_data.total)}
          </h4>
        </div>
        <div>
          <p className="text-muted-foreground text-sm! mb-2">
            {locale === routing.defaultLocale ? "Data Produk" : "Product Data"}
          </p>

          <TransactionStatusClientAdmin
            order_id={data.order_id}
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
        </div>
      </div>
      {/* <div className="bg-white max-h-screen overflow-y-auto text-wrap break-anywhere p-4 rounded-2xl border">
        <pre>{JSON.stringify(data, null, 2)}</pre>
      </div> */}
    </ContainerWrap>
  );
};

export default TransactionDetailAdmin;
