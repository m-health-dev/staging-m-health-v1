import { createClient } from "@/utils/supabase/client";
import React from "react";
import { getAccessToken, getUser } from "../../(auth)/actions/auth.actions";
import { User } from "@supabase/supabase-js";
import ContainerWrap from "@/components/utility/ContainerWrap";
import UnderConstruction from "@/components/utility/under-construction";
import { getLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import DynamicGreeting from "@/components/utility/DynamicGreeting";
import { getCurrentTime } from "@/lib/time/get-current-time";
import LocalDateTime from "@/components/utility/lang/LocaleDateTime";
import { getAITokenUsageStats } from "@/lib/chatbot/token-usage";

function getThreeWords(text: string | null): string {
  if (!text) return "";

  const words = text.trim().split(/\s+/);
  return words.slice(0, 3).join(" ");
}

const StudioDashboard = async () => {
  const supabase = await createClient();
  const user = await getUser();
  const accessToken = await getAccessToken();
  const locale = await getLocale();

  const time = await getCurrentTime();

  // Jalankan semua query secara paralel untuk load lebih cepat
  const [
    { data: accounts },
    { count: AccountTotal },
    { count: ChatSession },
    { count: Packages },
    { count: Wellness },
    { count: Medical },
    { count: Vendor },
    { count: Doctor },
    { count: Hotel },
    { count: Events },
    { count: Equipment },
    { count: Article },
    { count: ArticleAuthor },
    { count: ArticleCategory },
    { count: Hero },
    { count: Consultation },
    { count: Payment },
    { count: TOS },
    { count: Privacy },
    { count: Insurance },
    aiTokenStats,
  ] = await Promise.all([
    supabase.from("accounts").select("*").eq("id", user?.id).maybeSingle(),
    supabase.from("accounts").select("id", { count: "exact", head: true }),
    supabase.from("chat_activity").select("id", { count: "exact", head: true }),
    supabase.from("packages").select("id", { count: "exact", head: true }),
    supabase.from("wellness").select("id", { count: "exact", head: true }),
    supabase.from("medical").select("id", { count: "exact", head: true }),
    supabase.from("vendor").select("id", { count: "exact", head: true }),
    supabase.from("doctors").select("id", { count: "exact", head: true }),
    supabase.from("hotel").select("id", { count: "exact", head: true }),
    supabase.from("events").select("id", { count: "exact", head: true }),
    supabase
      .from("medical_equipment")
      .select("id", { count: "exact", head: true }),
    supabase.from("article").select("id", { count: "exact", head: true }),
    supabase.from("author").select("id", { count: "exact", head: true }),
    supabase
      .from("article_category")
      .select("id", { count: "exact", head: true }),
    supabase.from("hero_section").select("id", { count: "exact", head: true }),
    supabase
      .from("consult_schedule")
      .select("id", { count: "exact", head: true }),
    supabase
      .from("payment_records")
      .select("id", { count: "exact", head: true }),
    supabase
      .from("terms_of_service")
      .select("id", { count: "exact", head: true }),
    supabase
      .from("privacy_policy")
      .select("id", { count: "exact", head: true }),
    supabase.from("insurance").select("id", { count: "exact", head: true }),
    getAITokenUsageStats(),
  ]);

  return (
    <ContainerWrap>
      <DynamicGreeting
        name={getThreeWords(accounts?.fullname)}
        locale={locale}
      />

      <div className="bg-white border border-primary px-3 py-1 inline-flex mb-10 rounded-full text-primary">
        <p className="text-xs!">
          <LocalDateTime date={time} withSeconds />
        </p>
      </div>

      <div className="md:grid lg:grid-cols-4 md:grid-cols-2 flex flex-col gap-5">
        <div className="group/stats">
          <div className="bg-white rounded-2xl overflow-hidden relative border">
            <div className="px-4 py-5 bg-white rounded-2xl relative z-10 shadow-sm">
              <h3 className="text-primary font-semibold">{AccountTotal}</h3>
            </div>
            <div className="bg-primary text-white rounded-b-2xl px-4 pt-5 pb-2 -mt-3">
              <p>
                {locale === routing.defaultLocale
                  ? "Akun Telah Dibuat"
                  : "Account Created"}
              </p>
            </div>
          </div>
        </div>
        <div className="group/stats">
          <div className="bg-white rounded-2xl overflow-hidden relative border">
            <div className="px-4 py-5 bg-white rounded-2xl relative z-10 shadow-sm">
              <h3 className="text-primary font-semibold">{ChatSession}</h3>
            </div>
            <div className="bg-primary text-white rounded-b-2xl px-4 pt-5 pb-2 -mt-3">
              <p>
                {locale === routing.defaultLocale
                  ? "Sesi Percakapan"
                  : "Chat Sessions"}
              </p>
            </div>
          </div>
        </div>
        <div className="group/stats">
          <div className="bg-white rounded-2xl overflow-hidden relative border">
            <div className="px-4 py-5 bg-white rounded-2xl relative z-10 shadow-sm">
              <h3 className="text-primary font-semibold">{Consultation}</h3>
            </div>
            <div className="bg-primary text-white rounded-b-2xl px-4 pt-5 pb-2 -mt-3">
              <p>
                {locale === routing.defaultLocale
                  ? "Konsultasi Terjadwal"
                  : "Consultation Scheduled"}
              </p>
            </div>
          </div>
        </div>
        <div className="group/stats">
          <div className="bg-white rounded-2xl overflow-hidden relative border">
            <div className="px-4 py-5 bg-white rounded-2xl relative z-10 shadow-sm">
              <h3 className="text-primary font-semibold">{Payment}</h3>
            </div>
            <div className="bg-primary text-white rounded-b-2xl px-4 pt-5 pb-2 -mt-3">
              <p>
                {locale === routing.defaultLocale
                  ? "Transaksi Tercatat"
                  : "Transaction Recorded"}
              </p>
            </div>
          </div>
        </div>
        <div className="group/stats">
          <div className="bg-white rounded-2xl overflow-hidden relative border">
            <div className="px-4 py-5 bg-white rounded-2xl relative z-10 shadow-sm">
              <h3 className="text-primary font-semibold">{Packages}</h3>
            </div>
            <div className="bg-primary text-white rounded-b-2xl px-4 pt-5 pb-2 -mt-3">
              <p>{locale === routing.defaultLocale ? "Program" : "Programs"}</p>
            </div>
          </div>
        </div>
        <div className="group/stats">
          <div className="bg-white rounded-2xl overflow-hidden relative border">
            <div className="px-4 py-5 bg-white rounded-2xl relative z-10 shadow-sm">
              <h3 className="text-primary font-semibold">{Wellness}</h3>
            </div>
            <div className="bg-primary text-white rounded-b-2xl px-4 pt-5 pb-2 -mt-3">
              <p>
                {locale === routing.defaultLocale
                  ? "Paket Kebugaran"
                  : "Wellness Packages"}
              </p>
            </div>
          </div>
        </div>
        <div className="group/stats">
          <div className="bg-white rounded-2xl overflow-hidden relative border">
            <div className="px-4 py-5 bg-white rounded-2xl relative z-10 shadow-sm">
              <h3 className="text-primary font-semibold">{Medical}</h3>
            </div>
            <div className="bg-primary text-white rounded-b-2xl px-4 pt-5 pb-2 -mt-3">
              <p>
                {locale === routing.defaultLocale
                  ? "Paket Medis"
                  : "Medical Packages"}
              </p>
            </div>
          </div>
        </div>
        <div className="group/stats">
          <div className="bg-white rounded-2xl overflow-hidden relative border">
            <div className="px-4 py-5 bg-white rounded-2xl relative z-10 shadow-sm">
              <h3 className="text-primary font-semibold">{Vendor}</h3>
            </div>
            <div className="bg-primary text-white rounded-b-2xl px-4 pt-5 pb-2 -mt-3">
              <p>
                {locale === routing.defaultLocale
                  ? "Mitra & Rumah Sakit"
                  : "Partner & Hospital"}
              </p>
            </div>
          </div>
        </div>
        <div className="group/stats">
          <div className="bg-white rounded-2xl overflow-hidden relative border">
            <div className="px-4 py-5 bg-white rounded-2xl relative z-10 shadow-sm">
              <h3 className="text-primary font-semibold">{Insurance}</h3>
            </div>
            <div className="bg-primary text-white rounded-b-2xl px-4 pt-5 pb-2 -mt-3">
              <p>
                {locale === routing.defaultLocale ? "Asuransi" : "Insurance"}
              </p>
            </div>
          </div>
        </div>
        <div className="group/stats">
          <div className="bg-white rounded-2xl overflow-hidden relative border">
            <div className="px-4 py-5 bg-white rounded-2xl relative z-10 shadow-sm">
              <h3 className="text-primary font-semibold">{Doctor}</h3>
            </div>
            <div className="bg-primary text-white rounded-b-2xl px-4 pt-5 pb-2 -mt-3">
              <p>{locale === routing.defaultLocale ? "Dokter" : "Doctor"}</p>
            </div>
          </div>
        </div>
        <div className="group/stats">
          <div className="bg-white rounded-2xl overflow-hidden relative border">
            <div className="px-4 py-5 bg-white rounded-2xl relative z-10 shadow-sm">
              <h3 className="text-primary font-semibold">{Hotel}</h3>
            </div>
            <div className="bg-primary text-white rounded-b-2xl px-4 pt-5 pb-2 -mt-3">
              <p>{locale === routing.defaultLocale ? "Hotel" : "Hotel"}</p>
            </div>
          </div>
        </div>
        <div className="group/stats">
          <div className="bg-white rounded-2xl overflow-hidden relative border">
            <div className="px-4 py-5 bg-white rounded-2xl relative z-10 shadow-sm">
              <h3 className="text-primary font-semibold">{Equipment}</h3>
            </div>
            <div className="bg-primary text-white rounded-b-2xl px-4 pt-5 pb-2 -mt-3">
              <p>
                {locale === routing.defaultLocale
                  ? "Produk Medis"
                  : "Medical Products"}
              </p>
            </div>
          </div>
        </div>
        <div className="group/stats">
          <div className="bg-white rounded-2xl overflow-hidden relative border">
            <div className="px-4 py-5 bg-white rounded-2xl relative z-10 shadow-sm">
              <h3 className="text-primary font-semibold">{Events}</h3>
            </div>
            <div className="bg-primary text-white rounded-b-2xl px-4 pt-5 pb-2 -mt-3">
              <p>{locale === routing.defaultLocale ? "Acara" : "Events"}</p>
            </div>
          </div>
        </div>
        <div className="group/stats">
          <div className="bg-white rounded-2xl overflow-hidden relative border">
            <div className="px-4 py-5 bg-white rounded-2xl relative z-10 shadow-sm">
              <h3 className="text-primary font-semibold">{Article}</h3>
            </div>
            <div className="bg-primary text-white rounded-b-2xl px-4 pt-5 pb-2 -mt-3">
              <p>{locale === routing.defaultLocale ? "Artikel" : "Article"}</p>
            </div>
          </div>
        </div>
        <div className="group/stats">
          <div className="bg-white rounded-2xl overflow-hidden relative border">
            <div className="px-4 py-5 bg-white rounded-2xl relative z-10 shadow-sm">
              <h3 className="text-primary font-semibold">{ArticleAuthor}</h3>
            </div>
            <div className="bg-primary text-white rounded-b-2xl px-4 pt-5 pb-2 -mt-3">
              <p>
                {locale === routing.defaultLocale
                  ? "Penulis Artikel"
                  : "Article Author"}
              </p>
            </div>
          </div>
        </div>
        <div className="group/stats">
          <div className="bg-white rounded-2xl overflow-hidden relative border">
            <div className="px-4 py-5 bg-white rounded-2xl relative z-10 shadow-sm">
              <h3 className="text-primary font-semibold">{ArticleCategory}</h3>
            </div>
            <div className="bg-primary text-white rounded-b-2xl px-4 pt-5 pb-2 -mt-3">
              <p>
                {locale === routing.defaultLocale
                  ? "Kategori Artikel"
                  : "Article Category"}
              </p>
            </div>
          </div>
        </div>
        <div className="group/stats">
          <div className="bg-white rounded-2xl overflow-hidden relative border">
            <div className="px-4 py-5 bg-white rounded-2xl relative z-10 shadow-sm">
              <h3 className="text-primary font-semibold">{Hero}</h3>
            </div>
            <div className="bg-primary text-white rounded-b-2xl px-4 pt-5 pb-2 -mt-3">
              <p>
                {locale === routing.defaultLocale
                  ? "Banner Utama"
                  : "Hero Banner"}
              </p>
            </div>
          </div>
        </div>
        <div className="group/stats">
          <div className="bg-white rounded-2xl overflow-hidden relative border">
            <div className="px-4 py-5 bg-white rounded-2xl relative z-10 shadow-sm">
              <h3 className="text-primary font-semibold">{TOS}</h3>
            </div>
            <div className="bg-primary text-white rounded-b-2xl px-4 pt-5 pb-2 -mt-3">
              <p>
                {locale === routing.defaultLocale
                  ? "Syarat Layanan"
                  : "Terms of Service"}
              </p>
            </div>
          </div>
        </div>
        <div className="group/stats">
          <div className="bg-white rounded-2xl overflow-hidden relative border">
            <div className="px-4 py-5 bg-white rounded-2xl relative z-10 shadow-sm">
              <h3 className="text-primary font-semibold">{Privacy}</h3>
            </div>
            <div className="bg-primary text-white rounded-b-2xl px-4 pt-5 pb-2 -mt-3">
              <p>
                {locale === routing.defaultLocale
                  ? "Kebijakan Privasi"
                  : "Privacy Policy"}
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-white p-4 rounded-2xl mt-10">
        <h6 className="font-bold text-primary mb-4">
          {locale === routing.defaultLocale
            ? "Statistik Penggunaan Token Gemini API"
            : "Gemini API Token Usage Statistics"}
        </h6>

        <div className="md:grid lg:grid-cols-3 md:grid-cols-2 flex flex-col gap-5">
          <div className="group/stats">
            <div className="bg-white rounded-2xl overflow-hidden relative border">
              <div className="px-4 py-5 bg-white rounded-2xl relative z-10 shadow-sm">
                <h3 className="text-primary font-semibold">
                  {aiTokenStats.totals?.total_requests}
                </h3>
              </div>
              <div className="bg-primary text-white rounded-b-2xl px-4 pt-5 pb-2 -mt-3">
                <p>
                  {locale === routing.defaultLocale
                    ? "Permintaan AI Chat"
                    : "AI Chat Requests"}
                </p>
                <p className="text-sm! text-white/50">
                  {locale === routing.defaultLocale
                    ? "Percakapan"
                    : "Conversations"}
                </p>
              </div>
            </div>
          </div>
          <div className="group/stats">
            <div className="bg-white rounded-2xl overflow-hidden relative border">
              <div className="px-4 py-5 bg-white rounded-2xl relative z-10 shadow-sm">
                <h3 className="text-primary font-semibold">
                  {aiTokenStats.totals?.total_all_tokens}
                </h3>
              </div>
              <div className="bg-primary text-white rounded-b-2xl px-4 pt-5 pb-2 -mt-3">
                <p>
                  {locale === routing.defaultLocale
                    ? "Token AI Digunakan"
                    : "AI Tokens Used"}
                </p>
                <p className="text-sm! text-white/50">
                  {locale === routing.defaultLocale
                    ? "Input + Output & Thinking + Candidates"
                    : "Input + Output & Thinking + Candidates"}
                </p>
              </div>
            </div>
          </div>
          <div className="group/stats">
            <div className="bg-white rounded-2xl overflow-hidden relative border">
              <div className="px-4 py-5 bg-white rounded-2xl relative z-10 shadow-sm">
                <h3 className="text-primary font-semibold">
                  {aiTokenStats.totals?.total_thoughts_tokens}
                </h3>
              </div>
              <div className="bg-primary text-white rounded-b-2xl px-4 pt-5 pb-2 -mt-3">
                <p>
                  {locale === routing.defaultLocale
                    ? "Token Berpikir Digunakan"
                    : "AI Thinking Tokens Used"}
                </p>
                <p className="text-sm! text-white/50">
                  {locale === routing.defaultLocale
                    ? "Berpikir/ Proses + Output"
                    : "Thinking/ Processing + Output"}
                </p>
              </div>
            </div>
          </div>
          <div className="group/stats">
            <div className="bg-white rounded-2xl overflow-hidden relative border">
              <div className="px-4 py-5 bg-white rounded-2xl relative z-10 shadow-sm">
                <h3 className="text-primary font-semibold">
                  {aiTokenStats.totals?.total_prompt_tokens}
                </h3>
              </div>
              <div className="bg-primary text-white rounded-b-2xl px-4 pt-5 pb-2 -mt-3">
                <p>
                  {locale === routing.defaultLocale
                    ? "Token Prompt AI Digunakan"
                    : "AI Prompt Tokens Used"}
                </p>
                <p className="text-sm! text-white/50">
                  {locale === routing.defaultLocale
                    ? "Prompt/ Input"
                    : "Prompt/ Input"}
                </p>
              </div>
            </div>
          </div>
          <div className="group/stats">
            <div className="bg-white rounded-2xl overflow-hidden relative border">
              <div className="px-4 py-5 bg-white rounded-2xl relative z-10 shadow-sm">
                <h3 className="text-primary font-semibold">
                  {aiTokenStats.totals?.total_candidates_tokens}
                </h3>
              </div>
              <div className="bg-primary text-white rounded-b-2xl px-4 pt-5 pb-2 -mt-3">
                <p>
                  {locale === routing.defaultLocale
                    ? "Token Kandidat AI Digunakan"
                    : "AI Candidate Tokens Used"}
                </p>
                <p className="text-sm! text-white/50">
                  {locale === routing.defaultLocale
                    ? "Kandidat Jawaban"
                    : "Answer Candidates"}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="grid lg:grid-cols-2 grid-cols-1 gap-5 w-full mt-10">
          <div className="max-h-96 overflow-y-auto">
            <div className="sticky top-0 bg-background/20 backdrop-blur-md z-50 p-4 border rounded-2xl mb-4">
              <p className="text-sm! text-primary">
                {locale === routing.defaultLocale
                  ? "Statistik Penggunaan Harian"
                  : "DailyToken Usage Statistics"}
              </p>
            </div>
            <div>
              {aiTokenStats.daily?.length > 0 &&
                aiTokenStats.daily.map((dayStat: any) => (
                  <div className="group/stats" key={dayStat.date}>
                    <div className="bg-white rounded-2xl overflow-hidden relative border">
                      <div className="px-4 py-5 bg-white rounded-2xl relative z-10 shadow-sm md:grid md:grid-cols-2 grid-cols-1 gap-5 md:space-y-0 space-y-5 items-center">
                        <div>
                          <h3 className="text-primary font-semibold">
                            {dayStat.total_tokens}
                          </h3>
                          <p className="text-sm! text-muted-foreground mt-2">
                            {locale === routing.defaultLocale
                              ? "Total Token Digunakan"
                              : "Total Tokens Used"}
                          </p>
                        </div>

                        <div>
                          <h3 className="text-primary font-semibold">
                            {dayStat.request_count}
                          </h3>
                          <p className="text-sm! text-muted-foreground mt-2">
                            {locale === routing.defaultLocale
                              ? "Jumlah Permintaan"
                              : "Request Count"}
                          </p>
                        </div>
                      </div>
                      <div className="bg-primary text-white rounded-b-2xl px-4 pt-5 pb-2 -mt-3">
                        <p>
                          <LocalDateTime
                            date={dayStat.date}
                            specificFormat="DD MMMM YYYY"
                          />
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
          <div className="max-h-96 overflow-y-auto">
            <div className="sticky top-0 bg-background/20 backdrop-blur-md z-50 p-4 border rounded-2xl mb-4">
              <p className="text-sm! text-primary">
                {locale === routing.defaultLocale
                  ? "Statistik Penggunaan Model"
                  : "Model Usage Statistics"}
              </p>
            </div>
            <div>
              {aiTokenStats.by_model?.length > 0 &&
                aiTokenStats.by_model.map((stat: any) => (
                  <div className="group/stats" key={stat.model_version}>
                    <div className="bg-white rounded-2xl overflow-hidden relative border">
                      <div className="px-4 py-5 bg-white rounded-2xl relative z-10 shadow-sm md:grid md:grid-cols-2 grid-cols-1 gap-5 md:space-y-0 space-y-5 items-center">
                        <div>
                          <h3 className="text-primary font-semibold">
                            {stat.total_tokens}
                          </h3>
                          <p className="text-sm! text-muted-foreground mt-2">
                            {locale === routing.defaultLocale
                              ? "Total Token Digunakan"
                              : "Total Tokens Used"}
                          </p>
                        </div>

                        <div>
                          <h3 className="text-primary font-semibold">
                            {stat.request_count}
                          </h3>
                          <p className="text-sm! text-muted-foreground mt-2">
                            {locale === routing.defaultLocale
                              ? "Jumlah Permintaan"
                              : "Request Count"}
                          </p>
                        </div>
                      </div>
                      <div className="bg-primary text-white rounded-b-2xl px-4 pt-5 pb-2 -mt-3">
                        <p className="capitalize">
                          {stat.model_version.replaceAll("-", " ")}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>

        {/* <pre className="text-wrap wrap-anywhere text-sm!">
          {JSON.stringify(aiTokenStats, null, 2)}
        </pre> */}
      </div>
      <div className="bg-white p-4 border rounded-2xl mt-10">
        <p className="text-sm! text-primary mb-1">
          {locale === routing.defaultLocale
            ? "Token Akses Anda"
            : "Your Access Token"}
        </p>
        <pre className="text-wrap wrap-anywhere text-sm!">
          {JSON.stringify(accessToken, null, 2)}
        </pre>
      </div>
      <div className="my-10">
        <UnderConstruction element />
      </div>
    </ContainerWrap>
  );
};

export default StudioDashboard;
