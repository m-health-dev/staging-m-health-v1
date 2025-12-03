import { Button } from "@/components/ui/button";
import ContainerWrap from "@/components/utility/ContainerWrap";
import Wrapper from "@/components/utility/Wrapper";
import { createClient } from "@/utils/supabase/server";
import { jwtDecode } from "jwt-decode";
import Link from "next/link";
import { getUserRole } from "../../(auth)/actions/auth.actions";
import { getUserInfo } from "@/lib/auth/getUserInfo";

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

  const userData = await getUserInfo(session?.access_token);
  const role = await getUserRole();

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

      <pre className="text-wrap wrap-anywhere">
        {JSON.stringify(userData, null, 2)}
      </pre>
      <pre className="text-wrap wrap-anywhere">Role: {role}</pre>
    </>
  );
};

export default DashboardPage;
