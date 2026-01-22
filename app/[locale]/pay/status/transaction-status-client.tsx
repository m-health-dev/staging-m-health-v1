"use client";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import AvatarVendorHotel from "@/components/utility/AvatarVendorHotel";
import ContainerWrap from "@/components/utility/ContainerWrap";
import LocalDateTime from "@/components/utility/lang/LocaleDateTime";
import { stripHtml } from "@/helper/removeHTMLTag";
import { formatRupiah } from "@/helper/rupiah";
import { routing } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import { Mars, Stethoscope, Venus, VenusAndMars } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { v4 as uuidv4 } from "uuid";

type Props = {
  order_id: string;
  status_code?: string;
  transaction_status: string;
  locale: string;
  dataProduct?: any;
  productTypeTitle?: string;
  productType?: string;
  labels: any;
};

const TransactionStatusClient = ({
  order_id,
  status_code,
  transaction_status,
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
      `/${locale}/pay/${payID}?product=${data.product_data.id}&type=${data.product_data.type}`,
    );
  };

  return (
    <ContainerWrap size="md" className="my-20">
      {initialLoading ? (
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
            {locale === routing.defaultLocale
              ? "Terjadi Kesalahan"
              : "An Error Occurred"}
          </h3>
          <p className="text-red-500">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            {locale === routing.defaultLocale ? "Muat Ulang" : "Reload"}
          </button>
        </div>
      ) : !data ? (
        <div className="text-center p-10">
          <p>
            {locale === routing.defaultLocale
              ? "Data transaksi tidak ditemukan"
              : "Transaction data not found"}
          </p>
        </div>
      ) : (
        <div className="text-start bg-white p-5 rounded-2xl border">
          <p
            className={cn(
              "mb-2 capitalize  px-3 py-1 border rounded-full w-fit inline-flex",
              data.payment_status === "settlement" ||
                data.payment_status === "capture"
                ? "bg-health/10 text-health border-health"
                : data.payment_status === "pending"
                  ? "bg-amber-100 text-amber-600 border-amber-500"
                  : "bg-red-100 text-red-600 border-red-500",
            )}
          >
            {data.payment_status}
          </p>
          {data.payment_status === "settlement" ||
            (data.payment_status === "capture" && (
              <h2 className="text-3xl font-semibold mb-4 text-health">
                {locale === routing.defaultLocale
                  ? "Pembayaran Berhasil"
                  : "Payment Successful"}
              </h2>
            ))}
          {data.payment_status === "pending" && (
            <h2 className="text-3xl font-semibold mb-4 text-amber-500">
              {locale === routing.defaultLocale
                ? "Pembayaran Gagal"
                : "Payment Failed"}
            </h2>
          )}
          {data.payment_status === "expire" && (
            <h2 className="text-3xl font-semibold mb-4 text-red-500">
              {locale === routing.defaultLocale
                ? "Pembayaran Gagal"
                : "Payment Failed"}
            </h2>
          )}

          <p className="mb-2 text-primary">
            <span className="text-muted-foreground text-sm!">
              {locale === routing.defaultLocale ? "ID Pemesanan " : "Order ID "}
            </span>
            <br />
            {data.order_id}
          </p>

          {(data.payment_status === "settlement" ||
            data.payment_status === "capture") && (
            <p className="mt-4">
              {locale === routing.defaultLocale
                ? "Terima kasih telah melakukan pembayaran. Berikut adalah detail pembayaran Anda:"
                : "Thank you for your payment. Here are your payment details:"}
            </p>
          )}

          {/* <p className="text-muted-foreground mt-10">
            {locale === routing.defaultLocale ? "Total Pembayaran" : "Total Payment"}
          </p>
          <h4 className="text-primary font-bold">
            {formatRupiah(data.product_data.total)}
          </h4> */}

          {/* <pre>{JSON.stringify(data, null, 2)}</pre> */}

          <div>
            {order_id &&
              data.payment_status !== "settlement" &&
              data.payment_status !== "capture" && (
                <div className="mt-5 lg:w-fit w-full">
                  <Button
                    className="h-12 bg-health hover:bg-health rounded-full w-full disabled:opacity-70"
                    onClick={() => handleBuy()}
                    disabled={isLoading}
                  >
                    {isLoading && <Spinner />}
                    {isLoading
                      ? locale === routing.defaultLocale
                        ? "Memproses..."
                        : "Processing..."
                      : locale === routing.defaultLocale
                        ? "Coba Lagi"
                        : "Try Again"}
                  </Button>
                </div>
              )}
            {order_id &&
              (data.payment_status === "settlement" ||
                data.payment_status === "capture") &&
              productType !== "consultation" && (
                <div
                  className="mt-5 border-l-4 border-l-primary bg-primary/5
              px-4 py-4"
                >
                  <p className="text-xs! text-muted-foreground">
                    {locale === routing.defaultLocale
                      ? "Saat ini data pembayaran telah kami terima dan akan kami lakukan verifikasi ulang. Mohon berkenan untuk menunggu                  beberapa saat (Paling lambat 1x24 jam pada jam kerja 08.00-16.00 Waktu Indonesia Barat). Setelah pembayaran berhasil diverifikasi ulang,                  anda akan mendapatkan informasi mengenai pembelian ini melalui email/ nomor WhatsApp yang telah anda kirimkan. Terima kasih."
                      : "We have received your payment data and will re-verify it. Please wait for a moment (maximum 1x24 hours during working hours 08.00-16.00 Western Indonesia Time). Once the payment is successfully re-verified, you will receive information regarding this purchase via the email/ WhatsApp number you provided. Thank you. "}
                  </p>
                </div>
              )}

            {order_id &&
              (data.payment_status === "settlement" ||
                data.payment_status === "capture") &&
              productType === "consultation" && (
                <>
                  <div
                    className="mt-5 border-l-4 border-l-health bg-health/5
              px-4 py-4"
                  >
                    <p className="text-xs! text-health">
                      {locale === routing.defaultLocale
                        ? "Sesaat lagi anda akan menerima informasi detail konsultasi online melalui email & nomor WhatsApp yang telah anda daftarkan. Mohon hadir tepat waktu, jika waktu konsultasi telah berakhir dan anda belum hadir maka jadwal konsultasi anda akan hangus dan tidak dapat melakukan penjadwalan ulang. Terima kasih."
                        : "You will soon receive online consultation details via the registered email & WhatsApp number. Please be on time, if the consultation time has ended and you have not attended, your consultation schedule will be voided and you will not be able to reschedule. Thank you. "}
                    </p>
                  </div>
                  <div className="mt-5">
                    <p>
                      {locale === routing.defaultLocale
                        ? "Silakan klik tombol dibawah ini, untuk melihat status konsultasi online anda:"
                        : "Please click the button below to view your online consultation status:"}
                    </p>
                    <Button
                      variant={"outline"}
                      className="h-12 rounded-full mt-2"
                    >
                      <Link
                        href={`/${locale}/dashboard/consult/${data.product_data.id}`}
                        className="w-full"
                      >
                        {locale === routing.defaultLocale
                          ? "Lihat Status Konsultasi"
                          : "View Consultation Status"}
                      </Link>
                    </Button>
                  </div>
                </>
              )}

            {dataProduct ? (
              productType === "consultation" ? (
                <div className="bg-white rounded-2xl p-5 border my-10">
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
                    <p>
                      <LocalDateTime
                        date={dataProduct.data.scheduled_datetime}
                      />
                    </p>
                  </div>
                  {dataProduct.data.complaint && (
                    <div className="mt-5">
                      <p className="text-sm! text-muted-foreground">
                        {locale === routing.defaultLocale
                          ? "Kondisi/ Keluhan Kesehatan Anda"
                          : "Your Health Condition"}
                      </p>
                      <p>{dataProduct.data.complaint}</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-white rounded-2xl p-5 border grid lg:grid-cols-4 grid-cols-1 gap-5 w-full my-10">
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
                          <p className="text-pink-500 text-sm!">
                            {labels.female}
                          </p>
                        </div>
                      ) : (
                        <div className="inline-flex items-center gap-2 bg-health/10 px-3 py-1 rounded-full border border-health">
                          <VenusAndMars className="size-4 text-health" />
                          <p className="text-health text-sm!">
                            {labels.unisex}
                          </p>
                        </div>
                      )}
                    </div>
                    <h5 className="font-bold text-primary text-lg">
                      {locale === routing.defaultLocale
                        ? dataProduct.id_title
                        : dataProduct.en_title}
                    </h5>
                    <p>
                      {locale === routing.defaultLocale
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
              <div className="text-start p-5 bg-yellow-50 rounded-2xl border border-yellow-200 my-10">
                <h5 className="text-lg font-semibold text-yellow-600 mb-2">
                  {locale === routing.defaultLocale
                    ? "Produk Tidak Ditemukan"
                    : "Product Not Found"}
                </h5>
                <p className="text-yellow-500">
                  {locale === routing.defaultLocale
                    ? "Maaf, produk yang Anda beli tidak dapat ditemukan. Silakan hubungi layanan pelanggan untuk bantuan lebih lanjut."
                    : "Sorry, the product you purchased cannot be found. Please contact customer service for further assistance."}
                </p>
              </div>
            )}

            <div className="border-l-4 border-health px-4 py-2">
              <p className="text-muted-foreground text-sm!">
                {locale === routing.defaultLocale
                  ? "Mengalami kendala saat pembayaran atau memiliki pertanyaan mengenai pembelian?"
                  : "Having trouble with your payment or have questions about your purchase?"}
              </p>
              <p className="text-sm! mt-1">
                <Link href="/contact" className="text-health font-semibold">
                  {locale === routing.defaultLocale
                    ? "Hubungi Kami"
                    : "Contact Us"}
                </Link>
              </p>
            </div>
          </div>
          {/* <pre>{JSON.stringify(data, null, 2)}</pre>
          <pre>{JSON.stringify(dataProduct, null, 2)}</pre> */}
        </div>
      )}
    </ContainerWrap>
  );
};

export default TransactionStatusClient;
