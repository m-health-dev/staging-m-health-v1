import React from "react";
import { notFound } from "next/navigation";
import { getEventByID } from "@/lib/events/get-events";
import UpdateEventForm from "./updateForm";

const UpdateEventPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;
  const res = await getEventByID(id);

  if (res.error) {
    notFound();
  }
  return <UpdateEventForm id={id} data={res.data.data} />;
};

export default UpdateEventPage;
