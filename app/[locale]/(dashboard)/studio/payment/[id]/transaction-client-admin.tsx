"use client";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import AvatarVendorHotel from "@/components/utility/AvatarVendorHotel";
import ContainerWrap from "@/components/utility/ContainerWrap";
import LocalDateTime from "@/components/utility/lang/LocaleDateTime";
import { stripHtml } from "@/helper/removeHTMLTag";
import { formatRupiah } from "@/helper/rupiah";
import { cn } from "@/lib/utils";
import { Mars, Stethoscope, Venus, VenusAndMars } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { v4 as uuidv4 } from "uuid";

type Props = {
  order_id: string;
  locale: string;
  dataProduct?: any;
  productTypeTitle?: string;
  productType?: string;
  labels: any;
};

const TransactionStatusClientAdmin = ({
  order_id,
  locale,
  dataProduct,
  productType,
  productTypeTitle,
  labels,
}: Props) => {
  const [data, setData] = React.useState<any>(null);
  const [initialLoading, setInitialLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<string | null>(null);

  const [isLoading, setIsLoading] = React.useState(false);
  const router = useRouter();
  const payID = uuidv4();

  useEffect(() => {
    // Create AbortController to cancel fetch on unmount
    const abortController = new AbortController();
    let intervalId: NodeJS.Timeout;

    const fetchData = async (isInitial = false) => {
      if (isInitial) {
        setInitialLoading(true);
      }
      setError(null);

      try {
        const response = await fetch(`/api/check/transaction/${order_id}`, {
          signal: abortController.signal,
          cache: "no-store", // Prevent caching for real-time data
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();

        // Only update state if component is still mounted
        if (!abortController.signal.aborted) {
          setData(result.data);
          if (isInitial) {
            setInitialLoading(false);
          }
          console.log("Transaction status updated:", result);
        }
      } catch (error: any) {
        // Don't set error if fetch was aborted (component unmounted)
        if (error.name !== "AbortError" && !abortController.signal.aborted) {
          console.error("Error fetching transaction status:", error);
          setError(error.message || "Failed to fetch transaction data");
          if (isInitial) {
            setData(null);
            setInitialLoading(false);
          }
        }
      }
    };

    // Fetch initial data
    fetchData(true);

    // Set up polling every 5 seconds
    intervalId = setInterval(() => {
      fetchData(false);
    }, 5000);

    // Cleanup: abort fetch and clear interval on unmount
    return () => {
      abortController.abort();
      clearInterval(intervalId);
    };
  }, [order_id]); // Add order_id to dependency array

  const handleBuy = async () => {
    setIsLoading(true);
    router.push(
      `/${locale}/pay/${payID}?product=${data.product_data.id}&type=${data.product_data.type}`
    );
  };

  return initialLoading ? (
    <div className="flex flex-col space-y-5 p-10">
      <Skeleton className="h-12 w-3/4" />
      <Skeleton className="h-24 w-1/2" />
      <Skeleton className="h-12 w-full" />
      <Skeleton className="h-32 w-full" />
      <Skeleton className="h-12 w-1/2" />
    </div>
  ) : error ? (
    <div className="text-center p-10 bg-red-50 rounded-2xl border border-red-200">
      <h3 className="text-xl font-semibold text-red-600 mb-2">
        {locale === "id" ? "Terjadi Kesalahan" : "An Error Occurred"}
      </h3>
      <p className="text-red-500">{error}</p>
      <button
        onClick={() => window.location.reload()}
        className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
      >
        {locale === "id" ? "Muat Ulang" : "Reload"}
      </button>
    </div>
  ) : !data ? (
    <div className="text-center p-10">
      <p>
        {locale === "id"
          ? "Data transaksi tidak ditemukan"
          : "Transaction data not found"}
      </p>
    </div>
  ) : (
    <div>
      {dataProduct ? (
        productType === "consultation" ? (
          <Link
            href={`/${locale}/studio/consult/assign-doctor/${dataProduct.data.id}`}
          >
            <div className="bg-white rounded-2xl p-5 border">
              {/* <pre>{JSON.stringify(dataProduct, null, 2)}</pre> */}
              <h5 className="font-bold text-primary text-lg">
                <Stethoscope className="inline-block mr-2 size-5" />
                {locale === "id"
                  ? "Konsultasi dengan Dokter"
                  : "Consultation with Doctor"}
              </h5>
              <div className="mt-5">
                <p className="text-sm! text-muted-foreground">
                  {locale === "id"
                    ? "Jadwal Konsultasi Anda"
                    : "Your Consultation Schedule"}
                </p>
                <p>
                  <LocalDateTime date={dataProduct.data.scheduled_datetime} />
                </p>
              </div>
              {dataProduct.data.complaint && (
                <div className="mt-5">
                  <p className="text-sm! text-muted-foreground">
                    {locale === "id"
                      ? "Kondisi/ Keluhan Kesehatan Anda"
                      : "Your Health Condition"}
                  </p>
                  <p>
                    {locale === "id"
                      ? `${stripHtml(dataProduct.data.complaint)}`
                      : `${stripHtml(dataProduct.data.complaint)}`}
                  </p>
                </div>
              )}
            </div>
          </Link>
        ) : (
          <div className="bg-white rounded-2xl p-5 border grid lg:grid-cols-4 grid-cols-1 gap-5 w-full">
            <div className="lg:col-span-1 w-full">
              <Image
                src={
                  dataProduct.highlight_image ||
                  "https://placehold.co/300x300.png?text=IMAGE+NOT+FOUND"
                }
                alt="Product Image"
                width={300}
                height={300}
                className="w-full h-auto aspect-square rounded-2xl object-center object-cover"
              />
            </div>
            <div className="lg:col-span-3 w-full">
              <div className="mb-2">
                {dataProduct.spesific_gender === "male" ? (
                  <div className="inline-flex items-center gap-2 bg-blue-100 px-3 py-1 rounded-full border border-primary">
                    <Mars className="size-4 text-primary" />
                    <p className="text-primary text-sm!">{labels.male}</p>
                  </div>
                ) : dataProduct.spesific_gender === "female" ? (
                  <div className="inline-flex items-center gap-2 bg-pink-100 px-3 py-1 rounded-full border border-pink-400">
                    <Venus className="size-4 text-pink-500" />
                    <p className="text-pink-500 text-sm!">{labels.female}</p>
                  </div>
                ) : (
                  <div className="inline-flex items-center gap-2 bg-health/10 px-3 py-1 rounded-full border border-health">
                    <VenusAndMars className="size-4 text-health" />
                    <p className="text-health text-sm!">{labels.unisex}</p>
                  </div>
                )}
              </div>
              <h5 className="font-bold text-primary text-lg">
                {locale === "id" ? dataProduct.id_title : dataProduct.en_title}
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
        )
      ) : (
        <div className="text-start p-5 bg-yellow-50 rounded-2xl border border-yellow-200">
          <h5 className="text-lg font-semibold text-yellow-600 mb-2">
            {locale === "id" ? "Produk Tidak Ditemukan" : "Product Not Found"}
          </h5>
          <p className="text-yellow-500">
            {locale === "id"
              ? "Maaf, produk yang Anda beli tidak dapat ditemukan. Silakan hubungi layanan pelanggan untuk bantuan lebih lanjut."
              : "Sorry, the product you purchased cannot be found. Please contact customer service for further assistance."}
          </p>
        </div>
      )}
    </div>
  );
};

export default TransactionStatusClientAdmin;
