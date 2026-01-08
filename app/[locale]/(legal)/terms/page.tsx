import ContainerWrap from "@/components/utility/ContainerWrap";
import LocalDateTime from "@/components/utility/lang/LocaleDateTime";
import Wrapper from "@/components/utility/Wrapper";
import { routing } from "@/i18n/routing";
import { getLatestTermsOfService } from "@/lib/legal/get-legal";
import { getLocale } from "next-intl/server";
import React from "react";

const TermsPage = async () => {
  const { data: terms } = (await getLatestTermsOfService()).data;
  const locale = await getLocale();
  return (
    <Wrapper>
      <ContainerWrap size="lg" className="py-10">
        <h1 className="text-3xl font-bold text-primary mb-5 mt-10">
          {locale === "en" ? "Terms of Service" : "Syarat Layanan"}
        </h1>

        <p className="mb-20 text-muted-foreground">
          {locale === routing.defaultLocale
            ? "Terakhir diperbarui pada"
            : "Last updated at"}{" "}
          <LocalDateTime date={terms.updated_at} />
        </p>

        <div
          className="prose max-w-none font-sans"
          dangerouslySetInnerHTML={{
            __html:
              locale === routing.defaultLocale
                ? terms.id_content
                : terms.en_content,
          }}
        />
      </ContainerWrap>
    </Wrapper>
  );
};

export default TermsPage;
