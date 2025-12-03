import { createClient } from "@/utils/supabase/client";
import React from "react";
import { getUser } from "../../(auth)/actions/auth.actions";
import { User } from "@supabase/supabase-js";
import ContainerWrap from "@/components/utility/ContainerWrap";

function getThreeWords(text: string | null): string {
  if (!text) return "";

  const words = text.trim().split(/\s+/);
  return words.slice(0, 3).join(" ");
}

const StudioDashboard = async () => {
  const supabase = await createClient();
  const user = await getUser();
  const { data: accounts } = await supabase
    .from("accounts")
    .select("*")
    .eq("id", user?.id)
    .maybeSingle();
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
    </ContainerWrap>
  );
};

export default StudioDashboard;
