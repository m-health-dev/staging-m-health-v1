import { Button } from "@/components/ui/button";
import ContainerWrap from "@/components/utility/ContainerWrap";
import Wrapper from "@/components/utility/Wrapper";
import { createClient } from "@/utils/supabase/server";
import { jwtDecode } from "jwt-decode";
import Link from "next/link";
import { getAccessToken, getUserRole } from "../../(auth)/actions/auth.actions";
import { getUserInfo } from "@/lib/auth/getUserInfo";
import UnderConstruction from "@/components/utility/under-construction";
import { get } from "http";
import { getLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import DynamicGreeting from "@/components/utility/DynamicGreeting";
import LocalDateTime from "@/components/utility/lang/LocaleDateTime";
import { getCurrentTime } from "@/lib/time/get-current-time";

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
    return (
      <div className="p-6 text-red-600 font-medium">
        {locale === routing.defaultLocale
          ? "Gagal mendapatkan sesi pengguna"
          : "Failed to get user session"}
      </div>
    );
  }

  const role = await getUserRole();
  const accessToken = await getAccessToken();

  const userData = await getUserInfo(session.access_token);
  const time = await getCurrentTime();

  return (
    <>
      <div className="flex flex-wrap justify-between my-20 gap-5">
        <div>
          <DynamicGreeting
            name={getThreeWords(userData?.fullname)}
            locale={locale}
          />{" "}
          <div className="bg-white border border-primary px-3 py-1 inline-flex rounded-full text-primary">
            <p className="text-xs!">
              <LocalDateTime date={time} withSeconds />
            </p>
          </div>
        </div>
        <div className="flex items-center gap-5">
          {role === "admin" && (
            <Link href={"/std"}>
              <Button variant={"outline"} className="rounded-full h-12">
                Studio
              </Button>
            </Link>
          )}
          <Link href={"/sign-out"}>
            <Button variant={"destructive"} className="rounded-full h-12">
              {locale === routing.defaultLocale ? "Keluar" : "Sign Out"}
            </Button>
          </Link>
        </div>
      </div>

      <div className="my-10">
        <UnderConstruction element />
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
