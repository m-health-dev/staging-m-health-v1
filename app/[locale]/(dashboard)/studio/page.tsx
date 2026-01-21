import { createClient } from "@/utils/supabase/client";
import React from "react";
import { getAccessToken, getUser } from "../../(auth)/actions/auth.actions";
import { User } from "@supabase/supabase-js";
import ContainerWrap from "@/components/utility/ContainerWrap";
import UnderConstruction from "@/components/utility/under-construction";

function getThreeWords(text: string | null): string {
  if (!text) return "";

  const words = text.trim().split(/\s+/);
  return words.slice(0, 3).join(" ");
}

const StudioDashboard = async () => {
  const supabase = await createClient();
  const user = await getUser();
  const accessToken = await getAccessToken();

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
  ]);

  return (
    <ContainerWrap>
      <div className="my-10">
        <h4 className="font-semibold text-primary">
          Halo {getThreeWords(accounts?.fullname)}!
        </h4>
        <p className="mt-1 text-muted-foreground">
          Selamat datang di M Health Studio.
        </p>
      </div>

      <div className="md:grid lg:grid-cols-4 md:grid-cols-2 flex flex-col gap-5">
        <div className="group/stats">
          <div className="bg-white rounded-2xl overflow-hidden relative border">
            <div className="px-4 py-5 bg-white rounded-2xl relative z-10 shadow-sm">
              <h3 className="text-primary font-semibold">{AccountTotal}</h3>
            </div>
            <div className="bg-primary text-white rounded-b-2xl px-4 pt-5 pb-2 -mt-3">
              <p>Akun Telah Dibuat</p>
            </div>
          </div>
        </div>
        <div className="group/stats">
          <div className="bg-white rounded-2xl overflow-hidden relative border">
            <div className="px-4 py-5 bg-white rounded-2xl relative z-10 shadow-sm">
              <h3 className="text-primary font-semibold">{ChatSession}</h3>
            </div>
            <div className="bg-primary text-white rounded-b-2xl px-4 pt-5 pb-2 -mt-3">
              <p>Sesi Percakapan</p>
            </div>
          </div>
        </div>
        <div className="group/stats">
          <div className="bg-white rounded-2xl overflow-hidden relative border">
            <div className="px-4 py-5 bg-white rounded-2xl relative z-10 shadow-sm">
              <h3 className="text-primary font-semibold">{Consultation}</h3>
            </div>
            <div className="bg-primary text-white rounded-b-2xl px-4 pt-5 pb-2 -mt-3">
              <p>Consultation Scheduled</p>
            </div>
          </div>
        </div>
        <div className="group/stats">
          <div className="bg-white rounded-2xl overflow-hidden relative border">
            <div className="px-4 py-5 bg-white rounded-2xl relative z-10 shadow-sm">
              <h3 className="text-primary font-semibold">{Payment}</h3>
            </div>
            <div className="bg-primary text-white rounded-b-2xl px-4 pt-5 pb-2 -mt-3">
              <p>Transaction Recorded</p>
            </div>
          </div>
        </div>
        <div className="group/stats">
          <div className="bg-white rounded-2xl overflow-hidden relative border">
            <div className="px-4 py-5 bg-white rounded-2xl relative z-10 shadow-sm">
              <h3 className="text-primary font-semibold">{Packages}</h3>
            </div>
            <div className="bg-primary text-white rounded-b-2xl px-4 pt-5 pb-2 -mt-3">
              <p>Programs</p>
            </div>
          </div>
        </div>
        <div className="group/stats">
          <div className="bg-white rounded-2xl overflow-hidden relative border">
            <div className="px-4 py-5 bg-white rounded-2xl relative z-10 shadow-sm">
              <h3 className="text-primary font-semibold">{Wellness}</h3>
            </div>
            <div className="bg-primary text-white rounded-b-2xl px-4 pt-5 pb-2 -mt-3">
              <p>Wellness</p>
            </div>
          </div>
        </div>
        <div className="group/stats">
          <div className="bg-white rounded-2xl overflow-hidden relative border">
            <div className="px-4 py-5 bg-white rounded-2xl relative z-10 shadow-sm">
              <h3 className="text-primary font-semibold">{Medical}</h3>
            </div>
            <div className="bg-primary text-white rounded-b-2xl px-4 pt-5 pb-2 -mt-3">
              <p>Medical</p>
            </div>
          </div>
        </div>
        <div className="group/stats">
          <div className="bg-white rounded-2xl overflow-hidden relative border">
            <div className="px-4 py-5 bg-white rounded-2xl relative z-10 shadow-sm">
              <h3 className="text-primary font-semibold">{Vendor}</h3>
            </div>
            <div className="bg-primary text-white rounded-b-2xl px-4 pt-5 pb-2 -mt-3">
              <p>Partner & Hospital</p>
            </div>
          </div>
        </div>
        <div className="group/stats">
          <div className="bg-white rounded-2xl overflow-hidden relative border">
            <div className="px-4 py-5 bg-white rounded-2xl relative z-10 shadow-sm">
              <h3 className="text-primary font-semibold">{Insurance}</h3>
            </div>
            <div className="bg-primary text-white rounded-b-2xl px-4 pt-5 pb-2 -mt-3">
              <p>Insurance</p>
            </div>
          </div>
        </div>
        <div className="group/stats">
          <div className="bg-white rounded-2xl overflow-hidden relative border">
            <div className="px-4 py-5 bg-white rounded-2xl relative z-10 shadow-sm">
              <h3 className="text-primary font-semibold">{Doctor}</h3>
            </div>
            <div className="bg-primary text-white rounded-b-2xl px-4 pt-5 pb-2 -mt-3">
              <p>Doctor</p>
            </div>
          </div>
        </div>
        <div className="group/stats">
          <div className="bg-white rounded-2xl overflow-hidden relative border">
            <div className="px-4 py-5 bg-white rounded-2xl relative z-10 shadow-sm">
              <h3 className="text-primary font-semibold">{Hotel}</h3>
            </div>
            <div className="bg-primary text-white rounded-b-2xl px-4 pt-5 pb-2 -mt-3">
              <p>Hotel</p>
            </div>
          </div>
        </div>
        <div className="group/stats">
          <div className="bg-white rounded-2xl overflow-hidden relative border">
            <div className="px-4 py-5 bg-white rounded-2xl relative z-10 shadow-sm">
              <h3 className="text-primary font-semibold">{Equipment}</h3>
            </div>
            <div className="bg-primary text-white rounded-b-2xl px-4 pt-5 pb-2 -mt-3">
              <p>Medical Products</p>
            </div>
          </div>
        </div>
        <div className="group/stats">
          <div className="bg-white rounded-2xl overflow-hidden relative border">
            <div className="px-4 py-5 bg-white rounded-2xl relative z-10 shadow-sm">
              <h3 className="text-primary font-semibold">{Events}</h3>
            </div>
            <div className="bg-primary text-white rounded-b-2xl px-4 pt-5 pb-2 -mt-3">
              <p>Events</p>
            </div>
          </div>
        </div>
        <div className="group/stats">
          <div className="bg-white rounded-2xl overflow-hidden relative border">
            <div className="px-4 py-5 bg-white rounded-2xl relative z-10 shadow-sm">
              <h3 className="text-primary font-semibold">{Article}</h3>
            </div>
            <div className="bg-primary text-white rounded-b-2xl px-4 pt-5 pb-2 -mt-3">
              <p>Article</p>
            </div>
          </div>
        </div>
        <div className="group/stats">
          <div className="bg-white rounded-2xl overflow-hidden relative border">
            <div className="px-4 py-5 bg-white rounded-2xl relative z-10 shadow-sm">
              <h3 className="text-primary font-semibold">{ArticleAuthor}</h3>
            </div>
            <div className="bg-primary text-white rounded-b-2xl px-4 pt-5 pb-2 -mt-3">
              <p>Article Author</p>
            </div>
          </div>
        </div>
        <div className="group/stats">
          <div className="bg-white rounded-2xl overflow-hidden relative border">
            <div className="px-4 py-5 bg-white rounded-2xl relative z-10 shadow-sm">
              <h3 className="text-primary font-semibold">{ArticleCategory}</h3>
            </div>
            <div className="bg-primary text-white rounded-b-2xl px-4 pt-5 pb-2 -mt-3">
              <p>Article Category</p>
            </div>
          </div>
        </div>
        <div className="group/stats">
          <div className="bg-white rounded-2xl overflow-hidden relative border">
            <div className="px-4 py-5 bg-white rounded-2xl relative z-10 shadow-sm">
              <h3 className="text-primary font-semibold">{Hero}</h3>
            </div>
            <div className="bg-primary text-white rounded-b-2xl px-4 pt-5 pb-2 -mt-3">
              <p>Hero Banner</p>
            </div>
          </div>
        </div>
        <div className="group/stats">
          <div className="bg-white rounded-2xl overflow-hidden relative border">
            <div className="px-4 py-5 bg-white rounded-2xl relative z-10 shadow-sm">
              <h3 className="text-primary font-semibold">{TOS}</h3>
            </div>
            <div className="bg-primary text-white rounded-b-2xl px-4 pt-5 pb-2 -mt-3">
              <p>Terms of Service</p>
            </div>
          </div>
        </div>
        <div className="group/stats">
          <div className="bg-white rounded-2xl overflow-hidden relative border">
            <div className="px-4 py-5 bg-white rounded-2xl relative z-10 shadow-sm">
              <h3 className="text-primary font-semibold">{Privacy}</h3>
            </div>
            <div className="bg-primary text-white rounded-b-2xl px-4 pt-5 pb-2 -mt-3">
              <p>Privacy Policy</p>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-white p-4 border rounded-2xl mt-10">
        <p className="text-sm! text-primary mb-1">Your Access Token</p>
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
