"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbLink,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";

// locale Next-Intl kamu
const LOCALES = ["id", "en"];

export default function BreadcrumbAuto() {
  const pathname = usePathname();

  // contoh: "/id/studio/articles/edit"
  const segments = pathname.split("/").filter(Boolean);

  // ambil locale (segment pertama)
  const locale = LOCALES.includes(segments[0]) ? segments[0] : null;

  // segments breadcrumb tanpa locale
  const displaySegments = locale ? segments.slice(1) : segments;

  // bangun breadcrumb path (href) tetap pakai locale jika ada
  const paths = displaySegments.map((segment, index) => {
    const hrefSegments = [];

    if (locale) hrefSegments.push(locale);

    hrefSegments.push(...displaySegments.slice(0, index + 1));

    return {
      label: formatLabel(segment),
      href: "/" + hrefSegments.join("/"),
    };
  });

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem
          className={cn(
            pathname.endsWith(`/${locale}/studio`) ||
              pathname.endsWith(`/${locale}/dashboard`)
              ? "hidden"
              : "flex"
          )}
        >
          <BreadcrumbLink asChild>
            <Link
              href={
                pathname.startsWith(`/${locale}/studio`)
                  ? `/${locale}/studio`
                  : `/${locale}/dashboard`
              }
            >
              {pathname.startsWith(`/${locale}/studio`)
                ? `Studio`
                : `Dashboard`}
            </Link>
          </BreadcrumbLink>
        </BreadcrumbItem>

        {paths.slice(1).map((item, i) => (
          <div key={i} className="flex items-center gap-2">
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href={item.href}>{item.label}</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
          </div>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}

function formatLabel(str: string) {
  return str.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}
