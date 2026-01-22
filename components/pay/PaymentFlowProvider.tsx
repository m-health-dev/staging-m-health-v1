"use client";

import { createContext, useContext, useRef, useState } from "react";
import { Spinner } from "@/components/ui/spinner";
import { routing } from "@/i18n/routing";

export type BookingSubmitFn = () => Promise<boolean>;

type PaymentFlowContextType = {
  setBookingSubmit: (fn: BookingSubmitFn | null) => void;
  runBookingSubmit: () => Promise<boolean>;
  bookingLoading: boolean;
  setBookingLoading: (loading: boolean) => void;
  isProcessingPayment: boolean;
  setIsProcessingPayment: (processing: boolean) => void;
  locale?: string;
};

const PaymentFlowContext = createContext<PaymentFlowContextType | undefined>(
  undefined,
);

export const PaymentFlowProvider = ({
  children,
  locale = "id",
}: {
  children: React.ReactNode;
  locale?: string;
}) => {
  const submitRef = useRef<BookingSubmitFn | null>(null);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  const setBookingSubmit = (fn: BookingSubmitFn | null) => {
    submitRef.current = fn;
  };

  const runBookingSubmit = async () => {
    if (!submitRef.current) return true;
    return submitRef.current();
  };

  return (
    <PaymentFlowContext.Provider
      value={{
        setBookingSubmit,
        runBookingSubmit,
        bookingLoading,
        setBookingLoading,
        isProcessingPayment,
        setIsProcessingPayment,
        locale,
      }}
    >
      {isProcessingPayment && (
        <div className="fixed inset-0 z-9999 flex flex-col items-center justify-center bg-white/95 backdrop-blur-sm">
          <Spinner className="size-8 text-health mb-6" />
          <div className="text-center px-6 max-w-ld">
            <p className="text-lg font-semibold text-primary mb-1">
              {locale === routing.defaultLocale
                ? "Kami sedang memproses pesanan Anda"
                : "We are processing your order"}
            </p>
            <p className="text-muted-foreground">
              {locale === routing.defaultLocale
                ? "Sesaat lagi Anda akan diarahkan ke halaman pembayaran"
                : "You will be redirected to the payment page shortly"}
            </p>
          </div>
        </div>
      )}
      <div className={isProcessingPayment ? "invisible" : "visible"}>
        {children}
      </div>
    </PaymentFlowContext.Provider>
  );
};

export const usePaymentFlow = () => {
  const ctx = useContext(PaymentFlowContext);
  if (!ctx)
    throw new Error("usePaymentFlow must be used inside PaymentFlowProvider");
  return ctx;
};
