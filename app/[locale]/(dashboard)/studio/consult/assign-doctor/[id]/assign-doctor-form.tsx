"use client";

import { ComboBoxDoctorListOption } from "@/components/Form/ComboBoxDoctorListOption copy";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { assignDoctor } from "@/lib/doctor/post-patch-doctor";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";

import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

const doctorAssignSchema = z.object({
  doctor_id: z.string().min(1, "Doctor is required"),
});

const AssignDoctorForm = ({
  locale,
  readDoctorID,
  consultID,
}: {
  locale: string;
  readDoctorID?: string;
  consultID: string;
}) => {
  const [loading, setLoading] = React.useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof doctorAssignSchema>>({
    resolver: zodResolver(doctorAssignSchema),
    defaultValues: {
      doctor_id: readDoctorID || "",
    },
  });

  async function onSubmit(data: z.infer<typeof doctorAssignSchema>) {
    setLoading(true);
    const res = await assignDoctor(data, consultID);

    if (res.success) {
      setLoading(false);
      toast.success(`Doctor assigned successfully!`, {
        duration: 4000,
        description:
          "Message to whatsapp and email of the user and doctor in progress to send.",
      });
      router.refresh();
    } else if (res.error) {
      setLoading(false);
      toast.error(res.error);
    }
  }
  return (
    <div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="bg-white p-5 border rounded-4xl shadow-[inset_0px_-5px_0px_0px_var(--color-primary)] hover:shadow-[inset_0px_0px_0px_0px_var(--color-primary)] transition-all duration-300 max-w-xl"
        >
          <div className="space-y-5">
            <ComboBoxDoctorListOption readDoctorID={readDoctorID} />
          </div>
          <div className="mt-5">
            <Button
              type="submit"
              disabled={loading}
              className="h-12 rounded-full"
            >
              {loading ? "Assigning..." : "Assign Doctor"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default AssignDoctorForm;
