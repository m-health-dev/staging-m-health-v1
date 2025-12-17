import UnderConstruction from "@/components/utility/under-construction";
import React from "react";

const EventsContent = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  const { slug } = await params;
  return (
    <>
      <p className="text-center text-sm! text-muted-foreground py-5">{slug}</p>
      <UnderConstruction />
    </>
  );
};

export default EventsContent;
