"use client";

import { RichEditor } from "@/components/Form/RichEditor";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import {
  Dropzone,
  DropzoneEmptyState,
  DropzoneContent,
} from "@/components/ui/shadcn-io/dropzone";

import {
  ConsultationPriceSchema,
  MedicalSchema,
  PackageSchema,
  VendorSchema,
  WellnessSchema,
} from "@/lib/zodSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { EyeClosed, Eye, Trash, Percent } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import { toast } from "sonner";
import z from "zod";
import { Button } from "@/components/ui/button";
import { DynamicInputField } from "@/components/Form/DynamicInputField";
import { addVendor } from "@/lib/vendors/post-patch-vendor";
import ContainerWrap from "@/components/utility/ContainerWrap";
import { Spinner } from "@/components/ui/spinner";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import {
  addWellness,
  updateWellness,
} from "@/lib/wellness/post-patch-wellness";

import { Checkbox } from "@/components/ui/checkbox";
import { RupiahInput } from "@/components/Form/PriceInput";
import { WellnessType } from "@/types/wellness.types";
import { ComboBoxGender } from "@/components/Form/ComboBoxGender";
import { ComboBoxVendorListOption } from "@/components/Form/ComboBoxVendorListOption";
import { ComboBoxHotelListOption } from "@/components/Form/ComboBoxHotelListOption";
import { deleteWellness } from "@/lib/wellness/delete-wellness";
import { baseUrl } from "@/helper/baseUrl";
import { MedicalType } from "@/types/medical.types";
import { updateMedical } from "@/lib/medical/post-patch-medical";
import { Studio1DeleteCopyFunction } from "@/components/package-wellness-medical/package-wellness-medical-delete-copy-function";
import { deleteMedical } from "@/lib/medical/delete-medical";
import { PackageType } from "@/types/packages.types";
import { updatePackage } from "@/lib/packages/post-patch-packages";
import { deletePackage } from "@/lib/packages/delete-packages";
import { ComboBoxStatus } from "@/components/Form/ComboBoxStatus";
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
