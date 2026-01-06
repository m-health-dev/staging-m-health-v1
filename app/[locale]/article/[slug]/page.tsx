import AvatarAuthor from "@/components/utility/AvatarAuthor";
import ContainerWrap from "@/components/utility/ContainerWrap";
import LocalDateTime from "@/components/utility/lang/LocaleDateTime";
import UnderConstruction from "@/components/utility/under-construction";
import Wrapper from "@/components/utility/Wrapper";
import { routing } from "@/i18n/routing";
import { getArticlesBySlug } from "@/lib/articles/get-articles";
import { ArticleType } from "@/types/articles.types";
import { getLocale } from "next-intl/server";
import Image from "next/image";
import React from "react";

const ArticleContent = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  const { slug } = await params;
  const locale = await getLocale();

  const article: ArticleType = (await getArticlesBySlug(slug)).data.data;
  return (
    <Wrapper>
      <ContainerWrap size="lg">
        <div className="mb-5 mt-10">
          <div className="flex flex-row flex-wrap gap-3 mt-5">
            {article.category &&
              article.category.map((cat, i) => (
                <p
                  key={i}
                  className="capitalize bg-primary text-white px-3 py-1 rounded-full"
                >
                  {cat}
                </p>
              ))}
          </div>
          <h2 className="font-bold text-primary mt-5 mb-5">
            {locale === routing.defaultLocale
              ? article.id_title
              : article.en_title}
          </h2>
          <div className="flex items-center gap-4">
            <div className="w-10 h-0.25 bg-primary" />
            <p className="text-primary text-sm!">
              <LocalDateTime
                date={article.created_at}
                specificFormat="dddd, DD MMMM YYYY"
              />
            </p>
          </div>
          <div className="flex flex-row gap-5 mt-5">
            <div className="flex flex-wrap gap-5">
              {article.author &&
                article.author.map((author) => (
                  <div key={author.id}>
                    <AvatarAuthor author={author} size="md" locale={locale} />
                  </div>
                ))}
            </div>
          </div>
        </div>
      </ContainerWrap>
      <ContainerWrap size="xl">
        <div>
          <Image
            src={
              article.highlight_image ||
              "https://placehold.co/800x450.png?text=M+HEALTH+DEVELOPMENT"
            }
            alt={article.slug}
            width={1920}
            height={1080}
            className="w-full h-auto aspect-video rounded-2xl my-10 object-cover object-center"
          />
        </div>
      </ContainerWrap>
      <ContainerWrap size="lg" className="pb-20">
        <div
          className="prose max-w-none font-sans"
          dangerouslySetInnerHTML={{
            __html:
              locale === routing.defaultLocale
                ? article.id_content
                : article.en_content,
          }}
        />
      </ContainerWrap>
    </Wrapper>
  );
};

export default ArticleContent;
