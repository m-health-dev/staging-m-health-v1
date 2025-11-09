import ContainerWrap from "@/components/utility/ContainerWrap";
import LocalDateTime from "@/components/utility/LocaleDateTime";
import Wrapper from "@/components/utility/Wrapper";
import { getCommits } from "@/lib/GitChangeLog";
import Image from "next/image";

export default async function Changelog() {
  const commits: any[] = await getCommits();

  return (
    <Wrapper>
      <ContainerWrap>
        <h2 className="font-semibold text-primary text-center my-10">
          Deployment Changelog
        </h2>
        <div className="space-y-4 divide-y divide-primary/20 *:pb-4">
          {commits.map((c) => (
            <div key={c.sha}>
              <p className="text-muted-foreground text-sm!">
                {c.sha.slice(0, 7)}
              </p>
              <h5 className="text-primary font-semibold">{c.commit.message}</h5>
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
    </Wrapper>
  );
}
