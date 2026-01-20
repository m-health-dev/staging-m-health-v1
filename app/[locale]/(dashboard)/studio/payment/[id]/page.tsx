import ContainerWrap from "@/components/utility/ContainerWrap";
import { getPaymentsByOrderID } from "@/lib/transaction/get-payments-data";
import React from "react";

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

const TransactionDetailAdmin = async ({ params }: Props) => {
  const { id } = await params;

  const data = await getPaymentsByOrderID(id);

  return (
    <ContainerWrap>
      <div className="my-10">
        <h3 className="text-primary font-bold">Transaction Detail</h3>
      </div>
      <div className="bg-white max-h-screen overflow-y-auto text-wrap break-anywhere p-4 rounded-2xl border">
        <pre>{JSON.stringify(data, null, 2)}</pre>
      </div>
    </ContainerWrap>
  );
};

export default TransactionDetailAdmin;
