import ContainerWrap from "@/components/utility/ContainerWrap";
import LocalDateTime from "@/components/utility/lang/LocaleDateTime";
import Wrapper from "@/components/utility/Wrapper";
import { routing } from "@/i18n/routing";
import { createClient } from "@/utils/supabase/client";
import { Eye } from "lucide-react";
import { getLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import React from "react";

const PrivacyPreview = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;
  const locale = await getLocale();

  const supabase = createClient();
  const { data, error } = await supabase
    .from("privacy_policy")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) {
    return notFound();
  }
  return (
    <Wrapper>
      <ContainerWrap size="lg" className="py-10">
        <div className="flex flex-wrap items-center gap-5">
          <p className="bg-primary text-white px-3 py-1 inline-flex gap-2 items-center rounded-full">
            <Eye className="size-5" /> Preview Mode
          </p>
          <p className="bg-white border text-primary px-3 py-1 inline-flex gap-2 items-center rounded-full">
            v{data.version}
          </p>
        </div>
        <h1 className="text-3xl font-bold text-primary mb-5 mt-10">
          {locale === "en" ? "Privacy Policy" : "Kebijakan Privasi"}
        </h1>

        <p className="mb-20 text-muted-foreground">
          {locale === routing.defaultLocale
            ? "Terakhir diperbarui pada"
            : "Last updated at"}{" "}
          <LocalDateTime date={data.updated_at} />
        </p>

        <div
          className="prose max-w-none font-sans"
          dangerouslySetInnerHTML={{
            __html:
              locale === routing.defaultLocale
                ? data.en_content
                : data.id_content,
          }}
        />
      </ContainerWrap>
    </Wrapper>
  );
};

export default PrivacyPreview;
