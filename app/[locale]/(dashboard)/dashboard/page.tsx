import Wrapper from "@/components/utility/Wrapper";
import { getUserRole, signOutAction } from "@/lib/auth/auth";
import { createClient } from "@/utils/supabase/server";
import { supabaseClient } from "@/utils/supabase/helper";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";

const DashboardPage = async () => {
  const supabase = await createClient();
  const data = await supabase.auth.getUser();
  const role = await supabase.auth.getClaims();
  return (
    <Wrapper>
      <p>Dashboard</p>

      <pre>{JSON.stringify(data, null, 2)}</pre>
      <pre>{JSON.stringify(role, null, 2)}</pre>
    </Wrapper>
  );
};

export default DashboardPage;
