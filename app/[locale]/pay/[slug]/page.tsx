import ContainerWrap from "@/components/utility/ContainerWrap";
import Wrapper from "@/components/utility/Wrapper";
import PaymentSection from "./payment-section"; // Corrected import
import { PaymentFlowProvider } from "@/components/pay/PaymentFlowProvider";
import BookingClientForm from "./booking-form";
import AvatarVendorHotel from "@/components/utility/AvatarVendorHotel";
import { stripHtml } from "@/helper/removeHTMLTag";
import {
  calculateDiscount,
  calculateTaxes,
  formatRupiah,
} from "@/helper/rupiah";
import { getUserInfo } from "@/lib/auth/getUserInfo";
import { getMedicalEquipmentByID } from "@/lib/medical-equipment/get-medical-equipment";
import { getMedicalByID } from "@/lib/medical/get-medical";
import { getPackageByID } from "@/lib/packages/get-packages";
import { getWellnessByID } from "@/lib/wellness/get-wellness";
import { createClient } from "@/utils/supabase/server";
import { getLocale, getTranslations } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { forbidden, notFound } from "next/navigation";
import Image from "next/image";
import { Mars, Stethoscope, Venus, VenusAndMars } from "lucide-react";
import {
  getConsultationByID,
  getConsultationPrice,
} from "@/lib/consult/get-consultation";
import LocalDateTime from "@/components/utility/lang/LocaleDateTime";
// Booking form is used inside PaymentSection

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

const PaymentPage = async ({ params, searchParams }: Props) => {
  const { slug } = await params;
  const search = await searchParams;
  const locale = await getLocale();
  const t = await getTranslations("utility");

  const productType = search.type as string;
  const payID = slug as string;
  const productId = search.product as string;

  let data = null;
  let productTypeTitle = "";
  let priceConsultation = 0;

  if (!productId) {
    return notFound();
  }

  if (productType === "package") {
    const packageRes = await getPackageByID(productId as string);
    data = packageRes.data ? packageRes.data : null;

    productTypeTitle = locale === routing.defaultLocale ? "Program" : "Program";

    if (!data || data === undefined) {
      return notFound();
    }
  } else if (productType === "medical_equipment") {
    const medicalEquipmentRes = await getMedicalEquipmentByID(
      productId as string,
    );
    data = medicalEquipmentRes.data ? medicalEquipmentRes.data.data : null;
    productTypeTitle =
      locale === routing.defaultLocale ? "Peralatan Medis" : "Medical Products";

    if (!data || data === undefined) {
      return notFound();
    }
  } else if (productType === "medical") {
    const medicalRes = await getMedicalByID(productId as string);
    data = medicalRes.data ? medicalRes.data.data : null;
    productTypeTitle =
      locale === routing.defaultLocale ? "Paket Medis" : "Medical Package";

    if (!data || data === undefined) {
      return notFound();
    }
  } else if (productType === "wellness") {
    const wellnessRes = await getWellnessByID(productId as string);
    data = wellnessRes.data ? wellnessRes.data.data : null;
    productTypeTitle =
      locale === routing.defaultLocale ? "Paket Kebugaran" : "Wellness Package";

    if (!data || data === undefined) {
      return notFound();
    }
  } else if (productType === "consultation") {
    const consultationRes = await getConsultationByID(productId as string);
    data = consultationRes.data ? consultationRes.data : null;

    priceConsultation = (await getConsultationPrice()).data.price;
    productTypeTitle =
      locale === routing.defaultLocale ? "Konsultasi" : "Consultation";

    if (!data || data === undefined) {
      return notFound();
    }
  }

  let account = null;

  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (session?.user) {
    const userInfo = await getUserInfo(session.access_token);
    account = userInfo;
  }

  return (
    <Wrapper>
      <ContainerWrap className="my-20">
        {/* <pre>
          {JSON.stringify({ productType, payID, productId, data }, null, 2)}
        </pre> */}
        <div className="mb-5">
          <h2 className="font-bold text-primary text-2xl">
            {locale === routing.defaultLocale ? "Pembayaran" : "Payment"}
          </h2>
          <p className="bg-white px-3 py-1 rounded-full inline-flex text-muted-foreground mt-5 text-sm!">
            {productTypeTitle}
          </p>
        </div>
        <PaymentFlowProvider locale={locale}>
          <div className="grid lg:grid-cols-3 grid-cols-1 gap-10 items-start">
            <div className="lg:col-span-2 w-full product_information_and_booking_data">
              {productType === "consultation" ? (
                <div className="bg-white rounded-2xl p-5 border">
                  <h5 className="font-bold text-primary text-lg">
                    <Stethoscope className="inline-block mr-2 size-5" />
                    {locale === routing.defaultLocale
                      ? "Konsultasi dengan Dokter"
                      : "Consultation with Doctor"}
                  </h5>
                  <div className="mt-5">
                    <p className="text-sm! text-muted-foreground">
                      {locale === routing.defaultLocale
                        ? "Jadwal Konsultasi Anda"
                        : "Your Consultation Schedule"}
                    </p>
                    {/* <pre>{JSON.stringify(data, null, 2)}</pre> */}
                    <p>
                      <LocalDateTime date={data.data.scheduled_datetime} />
                    </p>
                  </div>
                  {data.data.complaint && (
                    <div className="mt-5">
                      <p className="text-sm! text-muted-foreground">
                        {locale === routing.defaultLocale
                          ? "Kondisi/ Keluhan Kesehatan Anda"
                          : "Your Health Condition"}
                      </p>
                      <p>{data.data.complaint}</p>
                    </div>
                  )}

                  <div className="price mt-5">
                    <div className="text-end">
                      <div className="flex flex-col items-end mt-2">
                        <p className="text-sm! text-muted-foreground">
                          {locale === routing.defaultLocale
                            ? "Subtotal"
                            : "Subtotal"}
                        </p>
                        <h5 className="text-primary font-bold">
                          {formatRupiah(priceConsultation)}
                        </h5>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-2xl p-5 border grid md:grid-cols-4 grid-cols-1 gap-5">
                  <div className="md:col-span-1 w-full">
                    <Image
                      src={data.highlight_image}
                      alt={
                        locale === routing.defaultLocale
                          ? "Gambar Produk"
                          : "Product Image"
                      }
                      width={300}
                      height={300}
                      className="w-full h-auto aspect-square rounded-2xl object-center object-cover"
                    />
                  </div>
                  <div className="lg:col-span-3 md:col-span-4 w-full">
                    <div className="mb-2">
                      {data.spesific_gender === "male" ? (
                        <div className="inline-flex items-center gap-2 bg-blue-100 px-3 py-1 rounded-full border border-primary">
                          <Mars className="size-4 text-primary" />
                          <p className="text-primary text-sm!">{t("male")}</p>
                        </div>
                      ) : data.spesific_gender === "female" ? (
                        <div className="inline-flex items-center gap-2 bg-pink-100 px-3 py-1 rounded-full border border-pink-400">
                          <Venus className="size-4 text-pink-500" />
                          <p className="text-pink-500 text-sm!">
                            {t("female")}
                          </p>
                        </div>
                      ) : (
                        <div className="inline-flex items-center gap-2 bg-health/10 px-3 py-1 rounded-full border border-health">
                          <VenusAndMars className="size-4 text-health" />
                          <p className="text-health text-sm!">{t("unisex")}</p>
                        </div>
                      )}
                    </div>
                    <h5 className="font-bold text-primary text-lg">
                      {locale === routing.defaultLocale
                        ? data.id_title
                        : data.en_title}
                    </h5>
                    <p>
                      {locale === routing.defaultLocale
                        ? data.id_tagline
                        : data.en_tagline}
                    </p>
                    <div className="mt-4">
                      <AvatarVendorHotel
                        size="sm"
                        type="vendor"
                        vendor_id={data.vendor_id}
                        locale={locale}
                      />
                    </div>
                    <div>
                      <div className="price mt-3">
                        <div className="text-start">
                          {data.discount_price >= 1 && (
                            <div className="inline-flex items-center gap-3">
                              <p className="text-muted-foreground">
                                <s>{formatRupiah(data.real_price)}</s>
                              </p>
                              <div className="font-semibold text-red-500 bg-red-50 border-red-500 border px-2 py-1 rounded-full inline-flex w-fit">
                                <p className="inline-flex gap-1 items-center text-xs!">
                                  {/* <Percent className="size-5 text-red-500 bg-white rounded-full p-1" /> */}
                                  {calculateDiscount(
                                    data.real_price,
                                    data.discount_price,
                                  )}
                                </p>
                              </div>
                            </div>
                          )}

                          <div className="flex flex-col items-start mt-2">
                            <p className="text-sm! text-muted-foreground">
                              {locale === routing.defaultLocale
                                ? "Subtotal"
                                : "Subtotal"}
                            </p>
                            <h5 className="text-primary font-bold">
                              {formatRupiah(
                                data.discount_price <= 0
                                  ? data.real_price
                                  : data.discount_price,
                              )}
                            </h5>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {productType !== "consultation" && (
                <div className="mt-10">
                  <BookingClientForm locale={locale} account={account} />
                </div>
              )}
            </div>
            <div className="lg:col-span-1 w-full bg-white border rounded-2xl p-5">
              <PaymentSection
                locale={locale}
                payID={payID}
                productType={productType}
                productId={productId}
                discountPrice={Number(
                  productType === "consultation" ? 0 : data.discount_price,
                )}
                realPrice={Number(
                  productType === "consultation"
                    ? priceConsultation
                    : data.real_price,
                )}
                account={account}
              />
            </div>
          </div>
        </PaymentFlowProvider>
      </ContainerWrap>
    </Wrapper>
  );
};

export default PaymentPage;
