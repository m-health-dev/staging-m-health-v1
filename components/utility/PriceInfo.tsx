"use client";

import { createPostTransaction } from "@/lib/transaction/create-transaction";
import { Account } from "@/types/account.types";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useState } from "react";
import { Button } from "../ui/button";
import { v4 as uuidv4 } from "uuid";

type PriceInfoType = {
  labels: any;
  product?: any;
  account?: Account;
  type: string;
};

export function calculateDiscount(real: number, disc: number) {
  const result = Math.round((disc / real) * 100);
  const calc = 100 - result;
  const response = `${calc}%`;

  return response;
}

function formatRupiah(value: number) {
  return new Intl.NumberFormat("id-ID").format(value);
}

const PriceInfo = ({ labels, product, account, type }: PriceInfoType) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const path = usePathname();
  const router = useRouter();
  const locale = path.split("/")[1] || "id";

  const payID = uuidv4();

  // let addressData = "";

  // try {
  //   const domicileJson = account?.domicile ? String(account.domicile) : "{}";
  //   const domicileObj = JSON.parse(domicileJson);

  //   addressData = domicileObj?.address || "";
  // } catch (error) {
  //   console.error("Error parsing domicile JSON:", error);
  //   addressData = "";
  // }

  const handleBuy = async () => {
    router.replace(
      `/${locale}/pay/${payID}?product=${product?.id}&type=${type}`
    );
  };

  // const addressData = account?.domicile?.address;

  // const handlePay = async () => {
  //   setIsLoading(true);
  //   setError(null);

  //   try {
  //     // console.log({ });

  //     const response = await createPostTransaction({
  //       order_id: payID,
  //       user_id: account?.id || "",
  //       first_name: account?.fullname.split(" ")[0] || "",
  //       last_name: account?.fullname.split(" ")[1] || "",
  //       email: account?.email || "",
  //       phone: String(account?.phone) || "",
  //       address: addressData || "",
  //       locale: locale,
  //       product_data: {
  //         type: type,
  //         id: product?.id || "",
  //       },
  //     });

  //     console.log("Payment response status:", response);

  //     const data = await response.data;

  //     if (!response.success) {
  //       throw new Error(data?.error || "Unable to start payment");
  //     }

  //     window.location.href = data.redirect_url;
  //   } catch (err) {
  //     console.error("Payment error:", err);
  //     setError("Gagal memulai pembayaran. Coba lagi.");
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };
  return (
    <div className="bg-white rounded-2xl border p-4 w-full">
      <p className="mb-3 font-medium">{labels.price_info}</p>
      <div className="price mt-5">
        <div className="text-end">
          <div className="inline-flex items-center gap-3">
            <p className="text-muted-foreground">
              <s>Rp{formatRupiah(product.real_price)}</s>
            </p>
            <div className="font-semibold text-red-500 bg-red-50 border-red-500 border px-2 py-1 rounded-full inline-flex w-fit">
              <p className="inline-flex gap-1 items-center text-xs!">
                {/* <Percent className="size-5 text-red-500 bg-white rounded-full p-1" /> */}
                {calculateDiscount(product.real_price, product.discount_price)}
              </p>
            </div>
          </div>

          <div className="flex justify-between items-end mt-2">
            <p className="text-sm! text-muted-foreground">Subtotal</p>
            <h5 className="text-primary font-bold">
              Rp{formatRupiah(product.discount_price)}
            </h5>
          </div>
        </div>
      </div>
      <div className="mt-5">
        {account?.id ? (
          <>
            {/* <button
              className="bg-health text-white w-full py-2 rounded-full"
              disabled={isLoading}
              onClick={handlePay}
            >
              <p>{isLoading ? "Processing..." : labels.buy}</p>
            </button>
            {error && (
              <p className="text-sm text-red-500 mt-2" role="alert">
                {error}
              </p>
            )} */}
            <Button
              className="h-12 bg-health hover:bg-health rounded-full w-full"
              onClick={() => handleBuy()}
            >
              {locale === "id" ? "Beli Sekarang" : "Buy Now"}
            </Button>
          </>
        ) : (
          <div className="bg-background p-4 rounded-2xl">
            <h6 className="text-primary font-bold">
              {locale === "id"
                ? "Anda harus masuk untuk melakukan pembelian."
                : "You must sign in to make a purchase."}
            </h6>
            <p className="text-muted-foreground mt-1">
              {locale === "id"
                ? "Untuk tujuan keamanan, silakan masuk untuk melanjutkan."
                : "For security purpose, please sign in to continue."}
            </p>
            <Button className="h-12 rounded-full w-full mt-5">
              <Link
                href={`/${locale}/sign-in?redirect=${encodeURIComponent(path)}`}
              >
                {locale === "id" ? "Masuk Sekarang" : "Sign In Now"}
              </Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PriceInfo;
