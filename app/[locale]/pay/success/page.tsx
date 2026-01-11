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

  const productType = data.product_data.type as string;
  const productId = data.product_data.id as string;

  let dataProduct = null;
  let productTypeTitle = "";

  if (!productId) {
    return notFound();
  }

  if (productType === "package") {
    dataProduct = (await getPackageByID(productId as string)).data;
    productTypeTitle = locale === "id" ? "Paket" : "Package";
  } else if (productType === "medical-equipment") {
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
  }
  return (
    <Wrapper>
      <ContainerWrap className="my-20">
        <div className="text-start bg-white p-5 rounded-2xl border">
          <p className="mb-2 capitalize bg-green-50 border-green-500 text-green-500 px-3 py-1 border rounded-full w-fit inline-flex">
            {transaction_status}
          </p>
          <h1 className="text-3xl font-semibold mb-4 text-health">
            {locale === "id" ? "Pembayaran Berhasil" : "Payment Successful"}
          </h1>
          <p className="mb-2 text-primary">{order_id}</p>

          <p className="mt-4">
            {locale === "id"
              ? "Terima kasih telah melakukan pembayaran. Berikut adalah detail pembayaran Anda:"
              : "Thank you for your payment. Here are your payment details:"}
          </p>

          <p className="text-muted-foreground mt-10">Total Pembayaran</p>
          <h4 className="text-primary font-bold">
            {formatRupiah(data.product_data.price)}
          </h4>

          <div>
            <div className="bg-white rounded-2xl p-5 border grid lg:grid-cols-4 grid-cols-1 gap-5 lg:max-w-2/4 w-full my-10">
              <div className="col-span-1">
                <Image
                  src={dataProduct.highlight_image}
                  alt="Product Image"
                  width={300}
                  height={300}
                  className="w-full h-auto aspect-square rounded-2xl object-center object-cover"
                />
              </div>
              <div className="col-span-3">
                <div className="mb-2">
                  {dataProduct.spesific_gender === "male" ? (
                    <div className="inline-flex items-center gap-2 bg-blue-100 px-3 py-1 rounded-full border border-primary">
                      <Mars className="size-4 text-primary" />
                      <p className="text-primary text-sm!">{t("male")}</p>
                    </div>
                  ) : dataProduct.spesific_gender === "female" ? (
                    <div className="inline-flex items-center gap-2 bg-pink-100 px-3 py-1 rounded-full border border-pink-400">
                      <Venus className="size-4 text-pink-500" />
                      <p className="text-pink-500 text-sm!">{t("female")}</p>
                    </div>
                  ) : (
                    <div className="inline-flex items-center gap-2 bg-health/10 px-3 py-1 rounded-full border border-health">
                      <VenusAndMars className="size-4 text-health" />
                      <p className="text-health text-sm!">{t("unisex")}</p>
                    </div>
                  )}
                </div>
                <h5 className="font-bold text-primary text-lg">
                  {locale === "id"
                    ? dataProduct.id_title
                    : dataProduct.en_title}
                </h5>
                <p>
                  {locale === "id"
                    ? dataProduct.id_tagline
                    : dataProduct.en_tagline}
                </p>
                <div className="mt-4">
                  <AvatarVendorHotel
                    size="sm"
                    type="vendor"
                    vendor_id={dataProduct.vendor_id}
                    locale={locale}
                  />
                </div>
              </div>
            </div>
          </div>
          {/* <pre>{JSON.stringify(data, null, 2)}</pre>
          <pre>{JSON.stringify(dataProduct, null, 2)}</pre> */}
        </div>
      </ContainerWrap>
    </Wrapper>
  );
};

export default SuccessPayment;
