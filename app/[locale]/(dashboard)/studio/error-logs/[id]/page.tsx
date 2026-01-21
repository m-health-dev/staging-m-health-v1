import ContainerWrap from "@/components/utility/ContainerWrap";
import { routing } from "@/i18n/routing";
import { getContactByID } from "@/lib/contact/get-contact";
import { getErrorLogByID } from "@/lib/error-logs/get-error-logs";
import { ContactType } from "@/types/contact.types";
import { ErrorLogType } from "@/types/error-logs.types";
import { getLocale } from "next-intl/server";
import React from "react";

const ErrorLogDetailMessage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;
  const data: ErrorLogType = (await getErrorLogByID(id)).data;
  const locale = await getLocale();
  return (
    <ContainerWrap>
      <div>
        <div className="my-10">
          <h2 className="text-2xl font-bold text-primary mb-4">
            Error Log Detail
          </h2>
        </div>
        <div className="space-y-5">
          <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
      </div>
    </ContainerWrap>
  );
};

export default ErrorLogDetailMessage;
