"use client";

import React from "react";
import { nanoid } from "nanoid";
import Link from "next/link";
import LocalDateTime from "@/components/utility/lang/LocaleDateTime";
import { routing } from "@/i18n/routing";
import SimplePagination from "@/components/utility/simple-pagination";
import { Skeleton } from "@/components/ui/skeleton";

type ChatActivityClientProps = {
  history: any[];
  links: any;
  meta: any;
  locale: string;
  perPage: number;
};

const ChatActivityClient = ({
  history,
  links,
  meta,
  locale,
  perPage,
}: ChatActivityClientProps) => {
  const [loading, setLoading] = React.useState(false);
  return (
    <div className="mb-[20vh]">
      <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-5">
        {loading
          ? Array.from({ length: perPage }).map(() => {
              const id = nanoid();
              return (
                <Skeleton key={id} className="rounded-2xl border p-4 h-60" />
              );
            })
          : history.map((h, i) => {
              const id = nanoid();
              return (
                <div key={id} className="bg-white rounded-2xl border p-4">
                  <Link href={`/${locale}/c/${h.id}`} target="_blank">
                    <div className="flex items-center justify-between mb-5">
                      <div className="flex items-center gap-2">
                        {h.urgent && (
                          <p className="capitalize bg-red-50 border border-red-600 text-red-600 inline-flex px-3 py-1 rounded-full text-sm!">
                            Urgent
                          </p>
                        )}
                        {h.status === "public" ? (
                          <p className="capitalize bg-blue-50 border border-blue-600 text-blue-600 inline-flex px-3 py-1 rounded-full text-sm!">
                            {h.status}
                          </p>
                        ) : (
                          <p className="capitalize bg-amber-50 border border-amber-600 text-amber-600 inline-flex px-3 py-1 rounded-full text-sm!">
                            {h.status}
                          </p>
                        )}
                      </div>
                    </div>
                    <h5 className="text-primary font-semibold mb-4">
                      {h.title}
                    </h5>
                    <p className="text-sm! text-muted-foreground">
                      {locale === routing.defaultLocale
                        ? "Dibuat pada"
                        : "Created at"}
                    </p>
                    <p>
                      <LocalDateTime date={h.created_at} />
                    </p>
                    <p className="text-sm! text-muted-foreground mt-2">
                      {locale === routing.defaultLocale
                        ? "Terakhir Diperbarui pada"
                        : "Last Updated at"}
                    </p>
                    <p>
                      <LocalDateTime date={h.updated_at} />
                    </p>
                  </Link>
                </div>
              );
            })}
      </div>

      <SimplePagination
        links={links}
        meta={meta}
        show={[10, 25, 50]}
        defaultPerPage={10}
        onLoadingChange={setLoading}
      />
    </div>
  );
};

export default ChatActivityClient;
