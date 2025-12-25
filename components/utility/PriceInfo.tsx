import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";

type PriceInfoType = {
  labels: any;
  real_price: number;
  discount_price: number;
  payID: string;
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

const PriceInfo = ({
  labels,
  real_price,
  discount_price,
  payID,
}: PriceInfoType) => {
  const router = useRouter();
  return (
    <div className="bg-white rounded-2xl border p-4 w-full">
      <p className="mb-3 font-medium">{labels.price_info}</p>
      <div className="price mt-5">
        <div className="text-end">
          <div className="inline-flex items-center gap-3">
            <p className="text-muted-foreground">
              <s>Rp{formatRupiah(real_price)}</s>
            </p>
            <div className="font-semibold text-red-500 bg-red-50 border-red-500 border px-2 py-1 rounded-full inline-flex w-fit">
              <p className="inline-flex gap-1 items-center text-xs!">
                {/* <Percent className="size-5 text-red-500 bg-white rounded-full p-1" /> */}
                {calculateDiscount(real_price, discount_price)}
              </p>
            </div>
          </div>

          <div className="flex justify-between items-end mt-2">
            <p className="text-sm! text-muted-foreground">Subtotal</p>
            <h5 className="text-primary font-bold">
              Rp{formatRupiah(discount_price)}
            </h5>
          </div>
        </div>
      </div>
      <div className="mt-5">
        <button
          className="bg-health text-white w-full py-2 rounded-full"
          onClick={() => router.push(`/pay/${payID}`)}
        >
          <p>{labels.buy}</p>
        </button>
      </div>
    </div>
  );
};

export default PriceInfo;
