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

  const { data: accounts } = await supabase
    .from("accounts")
    .select("*")
    .eq("id", user?.id)
    .maybeSingle();

  const { count: AccountTotal } = await supabase
    .from("accounts")
    .select("*", { count: "exact" });
  const { count: ChatSession } = await supabase
    .from("chat_activity")
    .select("*", { count: "exact" });
  const { count: Packages } = await supabase
    .from("packages")
    .select("*", { count: "exact" });
  const { count: Wellness } = await supabase
    .from("wellness")
    .select("*", { count: "exact" });
  const { count: Medical } = await supabase
    .from("medical")
    .select("*", { count: "exact" });
  const { count: Vendor } = await supabase
    .from("vendor")
    .select("*", { count: "exact" });
  const { count: Hotel } = await supabase
    .from("hotel")
    .select("*", { count: "exact" });
  const { count: Events } = await supabase
    .from("events")
    .select("*", { count: "exact" });
  const { count: Equipment } = await supabase
    .from("medical_equipment")
    .select("*", { count: "exact" });
  const { count: Article } = await supabase
    .from("article")
    .select("*", { count: "exact" });
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
              <h3 className="text-primary font-semibold">{Packages}</h3>
            </div>
            <div className="bg-primary text-white rounded-b-2xl px-4 pt-5 pb-2 -mt-3">
              <p>Packages</p>
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
              <p>Vendor</p>
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
              <p>Medical Equipment</p>
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
