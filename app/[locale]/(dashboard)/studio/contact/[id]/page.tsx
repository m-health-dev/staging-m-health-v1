import ContainerWrap from "@/components/utility/ContainerWrap";
import { routing } from "@/i18n/routing";
import { getContactByID } from "@/lib/contact/get-contact";
import { ContactType } from "@/types/contact.types";
import { getLocale } from "next-intl/server";
import React from "react";

const ContactDetailMessage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;
  const data: ContactType = (await getContactByID(id)).data;
  const locale = await getLocale();
  return (
    <ContainerWrap>
      <div>
        <div className="my-10">
          <h2 className="text-2xl font-bold text-primary mb-4">
            Contact Detail Message
          </h2>
        </div>
        <div className="space-y-5">
          <div>
            <p className="text-muted-foreground">
              {locale === routing.defaultLocale ? "Subjek" : "Subject"}
            </p>
            <h5 className="text-health font-semibold">{data.subject}</h5>
          </div>
          <div>
            <p className="text-muted-foreground">
              {locale === routing.defaultLocale ? "Pengirim" : "Sender"}
            </p>
            <p>
              {data.name} <br />
              <span className="text-health">{data.email}</span> <br />{" "}
              <span className="text-primary">{data.phone_number}</span>
            </p>
          </div>
          <div>
            <p className="text-muted-foreground">
              {locale === routing.defaultLocale ? "Pesan" : "Message"}
            </p>
            <p>{data.message}</p>
          </div>
        </div>
      </div>
    </ContainerWrap>
  );
};

export default ContactDetailMessage;
