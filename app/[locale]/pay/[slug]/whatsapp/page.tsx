import { getInsuranceBySlug } from "@/lib/insurance/get-insurance";
import { stripHtml } from "@/helper/removeHTMLTag";
import { routing } from "@/i18n/routing";
import { getLocale } from "next-intl/server";
import type { Metadata, ResolvingMetadata } from "next";
import { notFound, redirect } from "next/navigation";
import { InsuranceType } from "@/types/insurance.types";
import { baseUrl } from "@/helper/baseUrl";
import { WhatsAppRedirect } from "@/app/[locale]/insurance/[slug]/contact/WhatsAppRedirect";
import { getPackageByID } from "@/lib/packages/get-packages";
import { getMedicalEquipmentByID } from "@/lib/medical-equipment/get-medical-equipment";
import { getMedicalByID } from "@/lib/medical/get-medical";
import { getWellnessByID } from "@/lib/wellness/get-wellness";
import {
  getConsultationByID,
  getConsultationPrice,
} from "@/lib/consult/get-consultation";
import { getUserInfo } from "@/lib/auth/getUserInfo";
import { getAccessToken } from "@/app/[locale]/(auth)/actions/auth.actions";

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

// export async function generateMetadata(
//   { params, searchParams }: Props,
//   parent: ResolvingMetadata,
// ): Promise<Metadata> {
//   const slug = (await params).slug;

//   const locale = await getLocale();

//   const v: InsuranceType = (await getInsuranceBySlug(slug)).data.data;

//   const rawContent =
//     locale === routing.defaultLocale ? v.id_description : v.en_description;
//   const plainDescription = stripHtml(rawContent);

//   return {
//     title: `${v.name} - M HEALTH`,
//     description: `${plainDescription}`,
//     openGraph: {
//       title: `${v.name} - M HEALTH`,
//       description: `${plainDescription}`,
//       images: [
//         {
//           url:
//             v.highlight_image ||
//             `/api/og?title=${encodeURIComponent(
//               v.name,
//             )}&description=${encodeURIComponent(
//               plainDescription,
//             )}&path=${encodeURIComponent(`m-health.id/insurance/${slug}/contact`)}`,
//           width: 800,
//           height: 450,
//         },
//       ],
//     },
//   };
// }

const WhatsappPaymentDetailPage = async ({ params, searchParams }: Props) => {
  const { slug } = await params;
  const search = await searchParams;
  const locale = await getLocale();

  const token = await getAccessToken();

  if (!token) {
    notFound();
  }

  const userData = await getUserInfo(token);

  const productType = search.type as string;
  const payID = slug as string;
  const productId = slug as string;

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

  // Compose WhatsApp message
  const intro =
    locale === routing.defaultLocale
      ? productType === "consultation"
        ? `Halo, saya ingin melanjutkan konsultasi dengan ID Konsultasi ${productId}, mohon bantuannya untuk melanjutkan.\n`
        : `Halo, saya tertarik dengan produk ini, mohon bantuannya untuk detail informasi tentang produk dibawah ini:\n`
      : productType === "consultation"
        ? `Hello, I want to continue the consultation with Consultation ID ${productId}, please assist me to proceed.\n`
        : `Hello, I'm interested in this product, please assist me with the details of the product below:\n`;
  const slugData = `\nURL: ${baseUrl + "/" + productType === "package" ? "package" : productType === "medical_equipment" ? "equipment" : productType === "wellness" ? "wellness" : productType === "medical" ? "medical" : "404"}/${data.slug}`;
  const name = `\nProduct: ${data.name ? data.name : productType === "consultation" ? "Consultation" : locale === routing.defaultLocale ? data.id_title : data.en_title}`;

  const userDetail = `\n\n${locale === routing.defaultLocale ? "Informasi Pengguna" : "User Information"},\n${userData.fullname ? userData.fullname : userData.google_fullname}\n${userData.email}\n${userData.id.slice(0, 8).toUpperCase()}`;
  // const category =
  //   data.category && data.category.length
  //     ? `\n${data.category.join(", ")}`
  //     : "";
  // const desc =
  //   locale === routing.defaultLocale
  //     ? data.id_description
  //     : data.en_description;
  // const plainDesc = desc ? `\n${stripHtml(desc)}` : "";
  const msg = `${intro}${name}${productType === "consultation" ? "" : slugData}${userDetail}`;
  const encodedMsg = encodeURIComponent(msg);
  const waUrl = `https://wa.me/628113061173?text=${encodedMsg}`;

  // Render loading and redirect on client
  return <WhatsAppRedirect waUrl={waUrl} locale={locale} />;
};

export default WhatsappPaymentDetailPage;
