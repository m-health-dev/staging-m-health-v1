import { Button } from "@/components/ui/button";

import { createClient } from "@/utils/supabase/server";

import Link from "next/link";
import { getAccessToken, getUserRole } from "../../(auth)/actions/auth.actions";
import { getUserInfo } from "@/lib/auth/getUserInfo";

import { getLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import DynamicGreeting from "@/components/utility/DynamicGreeting";

import { getCurrentTime } from "@/lib/time/get-current-time";
import { getPaymentsByUser } from "@/lib/transaction/get-payments-data";
import UserTransactionHistoryCard from "./transactions/UserTransactionHistoryCard";
import { TransactionType } from "@/types/transaction.types";
import { nanoid } from "nanoid";
import { getMyConsultations } from "@/lib/consult/get-consultation";
import ConsultScheduleHistoryCard from "./consult/schedule/ConsultScheduleHistoryCard";
import { ConsultScheduleType } from "@/types/consult.types";
import ChatActivityCard from "./chat-activity/ChatActivityCard";
import { getChatHistoryByUserID } from "@/lib/chatbot/getChatActivity";
import { forbidden } from "next/navigation";

function getThreeWords(text: string | null): string {
  if (!text) return "";

  const words = text.trim().split(/\s+/);
  return words.slice(0, 3).join(" ");
}

const DashboardPage = async () => {
  const supabase = await createClient();
  const locale = await getLocale();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    forbidden();
  }

  const role = await getUserRole();
  const accessToken = await getAccessToken();

  const userData = await getUserInfo(session.access_token);
  const time = await getCurrentTime();

  const paymentRes = await getPaymentsByUser(userData?.id!, 1, 3);
  const history: TransactionType[] = paymentRes?.data ?? [];

  const consultRes = await getMyConsultations(1, 2);
  const consult: ConsultScheduleType[] = consultRes?.data ?? [];

  const chatRes = await getChatHistoryByUserID(userData?.id!, 1, 3);
  const chat: any[] = chatRes?.data?.data ?? [];

  return (
    <>
      <div className="flex lg:flex-wrap lg:flex-row flex-col justify-between my-20 gap-5">
        <div>
          <DynamicGreeting
            name={
              userData.fullname
                ? getThreeWords(userData?.fullname)
                : userData.google_fullname
                  ? getThreeWords(userData?.google_fullname)
                  : userData.email
            }
            locale={locale}
          />{" "}
          {/* <div className="bg-white border border-primary px-3 py-1 inline-flex rounded-full text-primary">
            <p className="text-xs!">
              <LocalDateTime date={time} withSeconds />
            </p>
          </div> */}
        </div>
        {role === "admin" && (
          <div className="flex items-center lg:flex-row flex-col gap-5">
            <Link href={"/std"} className="w-full">
              <Button variant={"outline"} className="rounded-full h-12 w-full">
                Studio
              </Button>
            </Link>

            <Link href={"/sign-out"} className="w-full">
              <Button
                variant={"destructive"}
                className="rounded-full h-12 w-full"
              >
                {locale === routing.defaultLocale ? "Keluar" : "Sign Out"}
              </Button>
            </Link>
          </div>
        )}
      </div>

      <div className="my-10 grid 3xl:grid-cols-3 lg:grid-cols-2 grid-cols-1 gap-5">
        <div className="bg-white rounded-2xl p-4 h-auto">
          <h4 className="font-semibold text-primary mt-2 mb-6">
            {locale === routing.defaultLocale
              ? "Riwayat Percakapan Terbaru"
              : "Recent Conversation History"}
          </h4>
          <div className="flex flex-col gap-5 w-full">
            {chat.length === 0 ? (
              <p className="text-start text-muted-foreground py-10">
                {locale === routing.defaultLocale
                  ? "Tidak ada riwayat percakapan."
                  : "No conversation history."}
              </p>
            ) : (
              chat.map((h) => {
                const id = nanoid();
                return (
                  <ChatActivityCard
                    key={h.id}
                    history={h}
                    locale={locale}
                    account={userData}
                  />
                );
              })
            )}
          </div>
        </div>
        <div className="bg-white rounded-2xl p-4 h-auto">
          <h4 className="font-semibold text-primary mt-2 mb-6">
            {locale === routing.defaultLocale
              ? "Riwayat Konsultasi Terbaru"
              : "Recent Consultation History"}
          </h4>
          <div className="flex flex-col gap-5 w-full">
            {consult.length === 0 ? (
              <p className="text-start text-muted-foreground py-10">
                {locale === routing.defaultLocale
                  ? "Tidak ada riwayat konsultasi."
                  : "No consultation history."}
              </p>
            ) : (
              consult.map((h) => {
                const id = nanoid();
                return (
                  <ConsultScheduleHistoryCard
                    key={h.id}
                    consult={h}
                    locale={locale}
                  />
                );
              })
            )}
          </div>
        </div>
        <div className="bg-white rounded-2xl p-4 h-auto">
          <h4 className="font-semibold text-primary mt-2 mb-6">
            {locale === routing.defaultLocale
              ? "Riwayat Transaksi Terbaru"
              : "Recent Transaction History"}
          </h4>
          <div className="flex flex-col gap-5 w-full">
            {history.length === 0 ? (
              <p className="text-start text-muted-foreground py-10">
                {locale === routing.defaultLocale
                  ? "Tidak ada riwayat transaksi."
                  : "No transaction history."}
              </p>
            ) : (
              history.map((h) => {
                const id = nanoid();
                return (
                  <UserTransactionHistoryCard
                    key={h.id}
                    history={h}
                    locale={locale}
                  />
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* <div className="bg-white p-4 border rounded-2xl mt-10">
        <p className="text-sm! text-primary mb-1">
          {locale === routing.defaultLocale
            ? "Token Akses Anda"
            : "Your Access Token"}
        </p>
        <pre className="text-wrap wrap-anywhere text-sm!">
          {JSON.stringify(accessToken, null, 2)}
        </pre>
      </div> */}

      {/* <pre className="text-wrap wrap-anywhere">
        {JSON.stringify(userData, null, 2)}
      </pre>
      <pre className="text-wrap wrap-anywhere">Role: {role}</pre> */}
    </>
  );
};

export default DashboardPage;
