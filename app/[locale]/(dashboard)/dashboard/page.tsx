import { Button } from "@/components/ui/button";
import ContainerWrap from "@/components/utility/ContainerWrap";
import Wrapper from "@/components/utility/Wrapper";
import { createClient } from "@/utils/supabase/server";
import { jwtDecode } from "jwt-decode";
import Link from "next/link";

const DashboardPage = async () => {
  const supabase = await createClient();

  const { data: userData } = await supabase.auth.getUser();

  const { data: claims } = await supabase.auth.getClaims();

  const { data: session } = await supabase.auth.getSession();

  return (
    <Wrapper>
      <ContainerWrap>
        <div className="flex justify-between my-20">
          <h3 className="font-bold text-primary">Dashboard</h3>
          <Link href={"/sign-out"}>
            <Button variant={"destructive"}>Sign Out</Button>
          </Link>
        </div>
        <pre>{JSON.stringify(userData, null, 2)}</pre>
        <pre className="text-wrap wrap-anywhere">
          User Role is {JSON.stringify(claims, null, 2)} |{" "}
          {JSON.stringify(session, null, 2)}
        </pre>
      </ContainerWrap>
    </Wrapper>
  );
};

export default DashboardPage;
