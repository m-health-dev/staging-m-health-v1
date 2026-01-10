import AvatarAuthor from "@/components/utility/AvatarAuthor";
import ContainerWrap from "@/components/utility/ContainerWrap";
import LocalDateTime from "@/components/utility/lang/LocaleDateTime";
import UnderConstruction from "@/components/utility/under-construction";
import Wrapper from "@/components/utility/Wrapper";
import { stripHtml } from "@/helper/removeHTMLTag";
import { routing } from "@/i18n/routing";
import { getArticlesBySlug } from "@/lib/articles/get-articles";
import { ArticleType } from "@/types/articles.types";
import { Metadata, ResolvingMetadata } from "next";
import { getLocale } from "next-intl/server";
import { headers } from "next/headers";
import Image from "next/image";
import React from "react";

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata(
  { params, searchParams }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const slug = (await params).slug;

  const article: ArticleType = (await getArticlesBySlug(slug)).data.data;

  const locale = await getLocale();

  const rawContent =
    locale === routing.defaultLocale ? article.id_content : article.en_content;

  const plainDescription = stripHtml(rawContent);

  return {
    title: `${
      locale === routing.defaultLocale ? article.id_title : article.en_title
    } - M HEALTH`,
    description: `${plainDescription.slice(0, 160)}...`,
    openGraph: {
      title: `${
        locale === routing.defaultLocale ? article.id_title : article.en_title
      } - M HEALTH`,
      description: `${plainDescription.slice(0, 160)}...`,
      images: [
        {
          url:
            article.highlight_image ||
            `/api/og?title=${encodeURIComponent(
              locale === routing.defaultLocale
                ? article.id_title
                : article.en_title
            )}&description=${encodeURIComponent(
              plainDescription.slice(0, 160) || "M HEALTH Official Website"
            )}&path=${encodeURIComponent(article.slug || "m-health.id")}`,
          width: 800,
          height: 450,
        },
      ],
    },
  };
}

const ArticleContent = async ({ params }: Props) => {
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
                  {locale === routing.defaultLocale
                    ? cat.id_category
                    : cat.en_category}
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
