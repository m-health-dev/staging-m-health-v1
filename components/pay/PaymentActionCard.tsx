"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { createPostTransaction } from "@/lib/transaction/create-transaction";
import { usePaymentFlow } from "@/components/pay/PaymentFlowProvider";
import { Account } from "@/types/account.types";
import { calculateDiscount, calculateTaxes } from "@/helper/rupiah";
import { Spinner } from "../ui/spinner";
import { routing } from "@/i18n/routing";

export type PaymentActionProps = {
  locale: string;
  payID: string;
  productType: string;
  productId: string;
  discountPrice?: number;
  realPrice: number;
  account: Account | null;
};

const PaymentActionCard = ({
  locale,
  payID,
  productType,
  productId,
  discountPrice,
  realPrice,
  account,
}: PaymentActionProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addressData = `${account?.domicile?.address || ""}, ${
    account?.domicile?.district || ""
  }, ${account?.domicile?.city || ""}, ${account?.domicile?.postal_code || ""}`;
  const firstName = account?.fullname?.split(" ")[0] || "";
  const lastName = account?.fullname?.split(" ")[1] || "";

  const taxes = calculateTaxes(
    Number(discountPrice ? discountPrice : realPrice),
    11,
  );

  const totalPrice = Number(discountPrice ? discountPrice : realPrice) + taxes;
  const { runBookingSubmit, bookingLoading, setIsProcessingPayment } =
    usePaymentFlow();

  const handlePay = async () => {
    if (!account?.id) {
      setError("Anda harus masuk untuk melakukan pembayaran.");
      return;
    }

    const ok = await runBookingSubmit();
    if (!ok) return;

    setIsLoading(true);
    setIsProcessingPayment(true);
    setError(null);

    try {
      const response = await createPostTransaction({
        // order_id: payID,
        user_id: account.id,
        first_name: firstName,
        last_name: lastName,
        email: account.email || "",
        phone: String(account.phone || ""),
        address: addressData,
        price: String(totalPrice),
        locale,
        product_data: {
          type: productType,
          id: productId,
        },
      });

      const data = await response.data;

      if (!response.success) {
        throw new Error(data?.error || "Unable to start payment");
      }

      window.location.href = data.redirect_url;
    } catch (err) {
      console.error("Payment error:", err);
      setError(
        locale === routing.defaultLocale
          ? "Gagal memulai pembayaran. Coba lagi."
          : "Failed to start payment. Please retry.",
      );
      setIsProcessingPayment(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <h4 className="font-bold text-primary text-2xl mb-5">
        {locale === routing.defaultLocale ? "Ringkasan Pesanan" : "Order Summary"}
      </h4>
      <div className="space-y-5">
        <div className="flex w-full justify-between items-end">
          <p className="text-muted-foreground text-xs!">Subtotal</p>
          <p>Rp{realPrice.toLocaleString("id-ID")}</p>
        </div>
        <hr />
        {discountPrice !== 0 && discountPrice && (
          <>
            <div className="flex w-full justify-between items-end">
              <p className="text-muted-foreground text-xs!">
                {locale === routing.defaultLocale ? "Potongan Harga" : "Discount"}
                <span className="text-xs bg-red-50 text-red-500 px-2 py-1 border border-red-500 rounded-full ml-2">
                  {calculateDiscount(realPrice, discountPrice)}
                </span>
              </p>
              <p>Rp{discountPrice.toLocaleString("id-ID")}</p>
            </div>
            <hr />
          </>
        )}

        <div className="flex w-full justify-between items-end">
          <p className="text-muted-foreground text-xs!">
            {locale === routing.defaultLocale ? "Pajak" : "Tax"}
            <span className="ml-1 text-xs text-muted-foreground">(11%)</span>
          </p>
          <p>Rp{taxes.toLocaleString("id-ID")}</p>
        </div>
        <hr />
        <div className="flex w-full justify-between items-center">
          <h5 className="font-bold text-primary">Total</h5>
          <h5 className="font-bold text-primary">
            Rp{totalPrice.toLocaleString("id-ID")}
          </h5>
        </div>
        <Button
          className="h-12 bg-health hover:bg-health rounded-full w-full"
          onClick={handlePay}
          disabled={isLoading || bookingLoading}
        >
          {(isLoading || bookingLoading) && <Spinner />}
          {isLoading || bookingLoading
            ? locale === routing.defaultLocale
              ? "Memproses..."
              : "Processing..."
            : locale === routing.defaultLocale
              ? "Lanjutkan ke Pembayaran"
              : "Continue"}
        </Button>
        {error && (
          <p className="text-sm text-red-500" role="alert">
            {error}
          </p>
        )}
      </div>
    </>
  );
};

export default PaymentActionCard;
