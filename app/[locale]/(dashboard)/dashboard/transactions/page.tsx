import LocalDateTime from "@/components/utility/lang/LocaleDateTime";
import { routing } from "@/i18n/routing";
import { getUserInfo } from "@/lib/auth/getUserInfo";
import { getChatHistoryByUserID } from "@/lib/chatbot/getChatActivity";
import { ChatHistory } from "@/types/chat.types";
import { createClient } from "@/utils/supabase/server";
import { getLocale } from "next-intl/server";
import { nanoid } from "nanoid";
import React from "react";
import Link from "next/link";
import ContainerWrap from "@/components/utility/ContainerWrap";
import SimplePagination from "@/components/utility/simple-pagination";
import ChatActivityClient from "./UserTransactionHistoryClient";
import { getPaymentsByUser } from "@/lib/transaction/get-payments-data";
import UserTransactionHistoryClient from "./UserTransactionHistoryClient";

const UserTransactionDash = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  const supabase = await createClient();
  const locale = await getLocale();
  const params = await searchParams;
  const page = Number(params.page ?? 1);
  const per_page = Number(params.per_page ?? 10);

  const user = (await supabase.auth.getUser()).data;
  const userID = user.user?.id;

  const { data, meta, links } =
    (await getPaymentsByUser(userID!, page, per_page)) || [];

  const history: any[] = data || [];

  return (
    <ContainerWrap>
      <div className="py-20">
        <h2 className="font-semibold text-primary">
          {locale === routing.defaultLocale
            ? "Riwayat Transaksi"
            : "Transaction History"}
        </h2>
      </div>

      {/* <pre>{JSON.stringify({ data, meta, links }, null, 2)}</pre> */}
      <UserTransactionHistoryClient
        history={history}
        links={links}
        meta={meta}
        locale={locale}
        perPage={per_page}
      />
    </ContainerWrap>
  );
};

export default UserTransactionDash;
