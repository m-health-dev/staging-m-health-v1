import { Button } from "@/components/ui/button";
import ContainerWrap from "@/components/utility/ContainerWrap";
import Wrapper from "@/components/utility/Wrapper";
import { createClient } from "@/utils/supabase/server";
import { jwtDecode } from "jwt-decode";
import Link from "next/link";
import { getAccessToken, getUserRole } from "../../(auth)/actions/auth.actions";
import { getUserInfo } from "@/lib/auth/getUserInfo";
import UnderConstruction from "@/components/utility/under-construction";

const DashboardPage = async () => {
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return (
      <div className="p-6 text-red-600 font-medium">
        Failed to get user session
      </div>
    );
  }

  const role = await getUserRole();
  const accessToken = await getAccessToken();

  return (
    <>
      <div className="flex flex-wrap justify-between my-20 gap-5">
        <h3 className="font-bold text-primary">Dashboard</h3>
        <div className="flex items-center gap-5">
          {role === "admin" && (
            <Link href={"/std"}>
              <Button variant={"outline"} className="rounded-2xl">
                Studio
              </Button>
            </Link>
          )}
          <Link href={"/sign-out"}>
            <Button variant={"destructive"} className="rounded-2xl">
              Sign Out
            </Button>
          </Link>
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

      {/* <pre className="text-wrap wrap-anywhere">
        {JSON.stringify(userData, null, 2)}
      </pre>
      <pre className="text-wrap wrap-anywhere">Role: {role}</pre> */}
    </>
  );
};

export default DashboardPage;
