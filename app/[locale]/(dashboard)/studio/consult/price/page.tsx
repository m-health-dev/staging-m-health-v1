import React from "react";
import SetConsultationPrice from "./set-consult-price";
import ContainerWrap from "@/components/utility/ContainerWrap";
import { getConsultationPrice } from "@/lib/consult/get-consultation";

const ConsultationPrice = async () => {
  const price = await getConsultationPrice();
  return (
    <ContainerWrap>
      <h3 className="text-primary font-semibold my-10">Consultation Price</h3>
      <SetConsultationPrice price={price.data} id={price.data.id} />
    </ContainerWrap>
  );
};

export default ConsultationPrice;
