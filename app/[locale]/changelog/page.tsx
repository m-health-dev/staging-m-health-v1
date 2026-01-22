import { Button } from "@/components/ui/button";
import ContainerWrap from "@/components/utility/ContainerWrap";
import LocalDateTime from "@/components/utility/lang/LocaleDateTime";
import Wrapper from "@/components/utility/Wrapper";
import { getCommits } from "@/lib/GitChangeLog";
import { routing } from "@/i18n/routing";
import { getLocale } from "next-intl/server";
import {
  ArrowLeftCircle,
  Code,
  GitCommitHorizontal,
  GitPullRequestCreateArrow,
  Turntable,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default async function Changelog() {
  const commits: any[] = await getCommits();
  const locale = await getLocale();

  return (
    <ContainerWrap>
      <div>
        <Link href={"/home?return_from=changelog"}>
          <Button
            variant="outline"
            className="rounded-full mt-10 text-primary pointer-events-auto cursor-pointer"
          >
            <ArrowLeftCircle className="mr-2 size-5" />
            {locale === routing.defaultLocale ? "Kembali ke Beranda" : "Back to Home"}
          </Button>
        </Link>
      </div>
      <div className="font-bold text-primary text-start py-10 sticky top-0 bg-linear-to-b from-background via-background z-20">
        <div className="flex lg:flex-row flex-col lg:items-center items-start gap-2">
          <div className="bg-white p-2 w-8 h-8 aspect-square rounded-full border border-primary flex justify-center items-center">
            <GitCommitHorizontal />
          </div>
          <h2>{locale === routing.defaultLocale ? "Catatan Perubahan Deployment" : "Deployment Changelog"}</h2>
        </div>
        <p className="text-sm! mt-5 font-normal text-health bg-white px-2 py-1 rounded-full border border-health inline-flex">
          {commits.length} {locale === routing.defaultLocale ? "komit" : "commits"}
        </p>
      </div>
      <div className="space-y-4 divide-y divide-primary/20 *:pb-4">
        {commits.map((c) => (
          <div key={c.sha}>
            <p className="text-muted-foreground text-sm!">
              {c.sha.slice(0, 7)}
            </p>
            <h5 className="text-primary font-bold">{c.commit.message}</h5>
            <div className="text-health">
              <LocalDateTime date={c.commit.committer.date} />
            </div>
            <div className="flex items-center gap-2 mt-2">
              <Image
                src={c.committer.avatar_url}
                width={50}
                height={50}
                alt={c.committer.login}
                className="w-5 h-5 aspect-square rounded-full"
              />
              <p className="text-sm! capitalize">
                {c.committer.login.replaceAll("-", " ")}
              </p>
            </div>
          </div>
        ))}
        {/* <pre>{JSON.stringify(commits, null, 2)}</pre> */}
      </div>
    </ContainerWrap>
  );
}
