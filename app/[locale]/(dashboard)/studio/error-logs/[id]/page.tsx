import ContainerWrap from "@/components/utility/ContainerWrap";

import { getErrorLogByID } from "@/lib/error-logs/get-error-logs";

import { ErrorLogType } from "@/types/error-logs.types";
import { getLocale } from "next-intl/server";
import React from "react";
import ErrorLogStatusEditor from "./ErrorLogStatusEditor";
import { createClient } from "@/utils/supabase/client";

const ErrorLogDetailMessage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;
  // const data: ErrorLogType = (await getErrorLogByID(id)).data;

  const supabase = await createClient();

  const { data: errorDetail, error } = await supabase
    .from("errors")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  const data: ErrorLogType = errorDetail;

  const location = await fetch(
    `http://ip-api.com/json/${data.ip_address}?fields=66846719`,
  ).then((res) => res.json());
  const locale = await getLocale();
  return (
    <ContainerWrap>
      <div className="mb-20">
        <div className="my-10">
          <h2 className="text-2xl font-bold text-primary mb-4">
            Error Log Detail
          </h2>
        </div>
        <div className="space-y-5 bg-white p-6 rounded-2xl mt-5">
          <ErrorLogStatusEditor id={data.id} currentStatus={data.status} />
        </div>
        <div className="space-y-5 bg-white p-6 rounded-2xl mt-5 ">
          <p className="text-sm! text-muted-foreground">
            Database Recorded Logs:
          </p>
          <pre className="text-wrap break-all">
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>
        <div className="space-y-5 bg-white p-6 rounded-2xl mt-5 ">
          <p className="text-sm! text-muted-foreground">Location Data:</p>
          <pre className="text-wrap break-all">
            {JSON.stringify(location, null, 2)}
          </pre>
        </div>
      </div>
    </ContainerWrap>
  );
};

export default ErrorLogDetailMessage;
