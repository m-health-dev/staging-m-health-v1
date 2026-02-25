"use client";

import { Form } from "@/components/ui/form";

import { ConsultationPriceSchema } from "@/lib/zodSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { EyeClosed, Eye, Trash, Percent } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import { toast } from "sonner";
import z from "zod";
import { Button } from "@/components/ui/button";

import { Spinner } from "@/components/ui/spinner";

import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";

import { RupiahInput } from "@/components/Form/PriceInput";

import { updateConsultationPrice } from "@/lib/consult/post-patch-consultation";
import { ConsultPrice } from "@/types/consult.types";
import { formatRupiah } from "@/helper/rupiah";

const UpdatePackageForm = ({
  price,
  id,
}: {
  price: ConsultPrice;
  id: string;
}) => {
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const locale = useLocale();

  const form = useForm<z.infer<typeof ConsultationPriceSchema>>({
    resolver: zodResolver(ConsultationPriceSchema),
    defaultValues: {
      price: Number(price?.price) || 0,
    },
  });

  async function onSubmit(data: z.infer<typeof ConsultationPriceSchema>) {
    setLoading(true);
    const res = await updateConsultationPrice(data);

    if (res.success) {
      setLoading(false);
      toast.success(
        `Consultation Price is successfully updated to ${formatRupiah(data.price)}!`,
      );
      router.refresh();
    } else if (res.error) {
      setLoading(false);
      toast.error(res.error);
    }
  }

  return (
    <div className="max-w-md">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="max-w-5xl">
          <fieldset disabled={loading}>
            <div className="space-y-5">
              <RupiahInput control={form.control} name="price" label="Price" />

              <div className="mt-5">
                <Button
                  type="submit"
                  size={"lg"}
                  disabled={loading}
                  className="rounded-full flex lg:w-fit w-full"
                >
                  {loading ? <Spinner /> : "Update"}
                </Button>
              </div>
            </div>
          </fieldset>
        </form>
      </Form>
    </div>
  );
};

export default UpdatePackageForm;
