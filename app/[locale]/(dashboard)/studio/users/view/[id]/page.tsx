import React from "react";

import { notFound } from "next/navigation";
import { getUserByID } from "@/lib/users/get-users";

import { getLocale, getTranslations } from "next-intl/server";
import ContainerWrap from "@/components/utility/ContainerWrap";
import Image from "next/image";
import { Account } from "@/types/account.types";

import Avatar from "boring-avatars";
import Link from "next/link";
import { Mars, Venus, VenusAndMars } from "lucide-react";

import LocalDateTime from "@/components/utility/lang/LocaleDateTime";
import { routing } from "@/i18n/routing";

const UserDetailPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;
  const res = await getUserByID(id);

  const t = await getTranslations("utility");

  const locale = await getLocale();

  if (res.error) {
    notFound();
  }

  const c: Account = res.data;

  return (
    <ContainerWrap>
      <h2 className="my-20 text-start text-primary font-bold">
        {locale === routing.defaultLocale ? "Data Pengguna" : "Users Data"}
      </h2>

      <div className="space-y-5 lg:col-span-2 w-full mb-[20vh]">
        {c.avatar_url ? (
          <Image
            src={c.avatar_url}
            height={300}
            width={300}
            alt={c.fullname}
            className="aspect-square object-cover w-32 h-32 rounded-full"
          />
        ) : c.google_avatar ? (
          <Image
            src={c.google_avatar}
            height={300}
            width={300}
            alt={c.fullname}
            className="aspect-square object-cover w-32 h-32 rounded-full"
          />
        ) : (
          <Avatar
            name={c.email}
            className="w-32! h-32!"
            colors={["#3e77ab", "#22b26e", "#f2f26f", "#fff7bd", "#95cfb7"]}
            variant="beam"
            size={32}
          />
        )}
        <div className="grid md:grid-cols-2 w-full grid-cols-1 gap-5">
          <div>
            <Link href={`mailto:${c.email}`}>
              <p className="text-muted-foreground">Email</p>
              <p>{c.email}</p>
            </Link>
          </div>
          {c.phone && (
            <div>
              <Link
                href={`whatsapp://send?phone=${String(c.phone).replaceAll(
                  "+",
                  "",
                )}`}
              >
                <p className="text-muted-foreground">Phone Number</p>
                <p>{c.phone ?? "N/A"}</p>
              </Link>
            </div>
          )}
        </div>
        <div className="grid md:grid-cols-2 w-full grid-cols-1 gap-5">
          <div>
            <p className="text-muted-foreground">Created at</p>
            <p>
              <LocalDateTime date={c.created_at} />
            </p>
          </div>
          <div>
            <p className="text-muted-foreground">Updated at</p>
            <p>
              <LocalDateTime date={c.updated_at} />
            </p>
          </div>
        </div>
        <div className="grid md:grid-cols-2 w-full grid-cols-1 gap-5">
          {c.fullname ? (
            <div>
              <p className="text-muted-foreground">Fullname</p>
              <p>{c.fullname ?? "N/A"}</p>
            </div>
          ) : c.google_fullname ? (
            <div>
              <p className="text-muted-foreground">Google Account Name</p>
              <p>{c.google_fullname ?? "N/A"}</p>
            </div>
          ) : null}
          {c.weight && (
            <div>
              <p className="text-muted-foreground">Weight</p>
              <p>{c.weight ?? "N/A"}kg</p>
            </div>
          )}
          {c.height && (
            <div>
              <p className="text-muted-foreground">Height</p>
              <p>{c.height ?? "N/A"}cm</p>
            </div>
          )}
          {c.gender && (
            <div>
              <p className="text-muted-foreground">Gender</p>
              {c.gender === "male" ? (
                <div className="inline-flex items-center gap-2 bg-blue-100 px-3 py-1 rounded-full border border-primary">
                  <Mars className="size-4 text-primary" />
                  <p className="text-primary text-sm!">{t("male")}</p>
                </div>
              ) : c.gender === "female" ? (
                <div className="inline-flex items-center gap-2 bg-pink-100 px-3 py-1 rounded-full border border-pink-400">
                  <Venus className="size-4 text-pink-500" />
                  <p className="text-pink-500 text-sm!">{t("female")}</p>
                </div>
              ) : (
                <div className="inline-flex items-center gap-2 bg-health/10 px-3 py-1 rounded-full border border-health">
                  <VenusAndMars className="size-4 text-health" />
                  <p className="text-health text-sm!">{t("unisex")}</p>
                </div>
              )}
            </div>
          )}

          {c.domicile && (
            <div>
              <p className="text-muted-foreground">Domicile/ Location</p>
              <div>
                {c.domicile.address && <p>{c.domicile.address ?? "N/A"}</p>}
                {c.domicile.district && <p>{c.domicile.district ?? "N/A"}</p>}
                {c.domicile.city && <p>{c.domicile.city ?? "N/A"}</p>}
                {c.domicile.postal_code && (
                  <p>{c.domicile.postal_code ?? "N/A"}</p>
                )}
              </div>
            </div>
          )}

          {c.birthdate && (
            <div>
              <p className="text-muted-foreground">Birthdate</p>
              <p>
                <LocalDateTime date={c.birthdate} />
              </p>
            </div>
          )}
        </div>
      </div>

      {/* <div className="text-wrap break-anywhere">
        <pre>{JSON.stringify(res.data, null, 2)}</pre>
      </div> */}
    </ContainerWrap>
  );
};

export default UserDetailPage;
