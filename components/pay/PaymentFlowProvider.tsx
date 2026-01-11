"use client";

import { createContext, useContext, useRef, useState } from "react";

export type BookingSubmitFn = () => Promise<boolean>;

type PaymentFlowContextType = {
  setBookingSubmit: (fn: BookingSubmitFn | null) => void;
  runBookingSubmit: () => Promise<boolean>;
  bookingLoading: boolean;
  setBookingLoading: (loading: boolean) => void;
};

const PaymentFlowContext = createContext<PaymentFlowContextType | undefined>(
  undefined
);

export const PaymentFlowProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const submitRef = useRef<BookingSubmitFn | null>(null);
  const [bookingLoading, setBookingLoading] = useState(false);

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
      }}
    >
      {children}
    </PaymentFlowContext.Provider>
  );
};

export const usePaymentFlow = () => {
  const ctx = useContext(PaymentFlowContext);
  if (!ctx)
    throw new Error("usePaymentFlow must be used inside PaymentFlowProvider");
  return ctx;
};
