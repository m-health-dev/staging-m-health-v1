"use client";

import Image from "next/image";
import React from "react";
import ContainerWrap from "../ContainerWrap";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { locale } from "dayjs";
import { LanguageSwitcher } from "../lang/LanguageSwitcher";
import Link from "next/link";
import { ArrowRightToLine, LogIn, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useLocale } from "next-intl";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

const NavHeader = () => {
  const locale = useLocale();
  const path = usePathname();
  const pathCheck =
    path.startsWith(`/${locale}`) && path.endsWith(`/${locale}`);
  return pathCheck ? (
    <nav className="sticky top-0 px-5 bg-background z-99 lg:border-b-0 border-b border-primary/10">
      <header className="py-5 flex w-full justify-between">
        <Image
          src={"/mhealth_logo.PNG"}
          width={150}
          height={40}
          className="object-contain"
          alt="M-Health Logo"
        />
        <div>
          <div>
            <Sheet>
              <SheetTrigger className=" bg-white text-primary p-2 rounded-full">
                {" "}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="size-8"
                >
                  <path
                    fillRule="evenodd"
                    d="M3 6.75A.75.75 0 0 1 3.75 6h16.5a.75.75 0 0 1 0 1.5H3.75A.75.75 0 0 1 3 6.75ZM3 12a.75.75 0 0 1 .75-.75h16.5a.75.75 0 0 1 0 1.5H3.75A.75.75 0 0 1 3 12Zm0 5.25a.75.75 0 0 1 .75-.75h16.5a.75.75 0 0 1 0 1.5H3.75a.75.75 0 0 1-.75-.75Z"
                    clipRule="evenodd"
                  />
                </svg>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="p-8 bg-white z-999 overflow-y-scroll hide-scroll"
              >
                <SheetTitle />
                <SheetClose className="flex items-center justify-end pointer-events-auto gap-2 cursor-pointer">
                  <h4 className="text-primary font-bold">Tutup</h4>
                  <div className="text-primary bg-background p-2 rounded-full">
                    <X />
                  </div>
                </SheetClose>
                <div className="flex flex-col space-y-7 mt-5">
                  <Link
                    href={`/${locale}/home`}
                    className="group"
                    data-cursor-clickable
                  >
                    <h3 className="font-bold text-primary">Beranda</h3>
                  </Link>
                  <Link
                    href={`/${locale}/about`}
                    className="group"
                    data-cursor-clickable
                  >
                    <h3 className="font-bold text-primary">Tentang Kami</h3>
                  </Link>
                  <Link
                    href={`/${locale}/wellness`}
                    className="group"
                    data-cursor-clickable
                  >
                    <h3 className="font-bold text-primary">Kesehatan</h3>
                  </Link>
                  <Link
                    href={`/${locale}/medical`}
                    className="group"
                    data-cursor-clickable
                  >
                    <h3 className="font-bold text-primary">Medis</h3>
                  </Link>
                  <Link
                    href={`/${locale}/medical-equipment`}
                    className="group"
                    data-cursor-clickable
                  >
                    <h3 className="font-bold text-primary">Alat Kesehatan</h3>
                  </Link>
                  <Link
                    href={`/${locale}/article`}
                    className="group"
                    data-cursor-clickable
                  >
                    <h3 className="font-bold text-primary">Artikel</h3>
                  </Link>
                  <Link
                    href={`/${locale}/events`}
                    className="group"
                    data-cursor-clickable
                  >
                    <h3 className="font-bold text-primary">Acara</h3>
                  </Link>
                  <Link
                    href={`/${locale}/events`}
                    className="group"
                    data-cursor-clickable
                  >
                    <h3 className="font-bold text-primary">Kontak</h3>
                  </Link>
                </div>

                <SheetFooter className="bg-gray-50 rounded-2xl border border-primary/10 mt-10">
                  <h5 className="text-primary font-bold mb-0">Preferensi</h5>
                  <div className="z-9999">
                    <LanguageSwitcher />
                  </div>
                </SheetFooter>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>
    </nav>
  ) : (
    <ContainerWrap className="sticky top-10 z-99">
      <nav className="px-5 z-99 lg:border-b-0 border-b border-primary/10 bg-white rounded-full mt-10">
        <header className="py-5 flex w-full justify-between">
          <Image
            src={"/mhealth_logo.PNG"}
            width={150}
            height={40}
            className="object-contain"
            alt="M-Health Logo"
          />
          <div>
            <div className="lg:hidden flex">
              <Sheet>
                <SheetTrigger className=" bg-white text-primary p-2 rounded-full">
                  {" "}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="size-8"
                  >
                    <path
                      fillRule="evenodd"
                      d="M3 6.75A.75.75 0 0 1 3.75 6h16.5a.75.75 0 0 1 0 1.5H3.75A.75.75 0 0 1 3 6.75ZM3 12a.75.75 0 0 1 .75-.75h16.5a.75.75 0 0 1 0 1.5H3.75A.75.75 0 0 1 3 12Zm0 5.25a.75.75 0 0 1 .75-.75h16.5a.75.75 0 0 1 0 1.5H3.75a.75.75 0 0 1-.75-.75Z"
                      clipRule="evenodd"
                    />
                  </svg>
                </SheetTrigger>
                <SheetContent side="right" className="p-8 bg-white z-999">
                  <SheetTitle />
                  <SheetClose className="flex items-center justify-end pointer-events-auto gap-2 cursor-pointer">
                    <h4 className="text-primary font-bold">Tutup</h4>
                    <div className="text-primary bg-background p-2 rounded-full">
                      <X />
                    </div>
                  </SheetClose>
                  <div className="flex flex-col space-y-7 mt-5">
                    <Link
                      href={`/${locale}/about`}
                      className="group"
                      data-cursor-clickable
                    >
                      <h3 className="font-bold text-primary">Tentang Kami</h3>
                    </Link>
                    <Link
                      href={`/${locale}/wellness`}
                      className="group"
                      data-cursor-clickable
                    >
                      <h3 className="font-bold text-primary">Kesehatan</h3>
                    </Link>
                    <Link
                      href={`/${locale}/medical`}
                      className="group"
                      data-cursor-clickable
                    >
                      <h3 className="font-bold text-primary">Medis</h3>
                    </Link>
                    <Link
                      href={`/${locale}/medical-equipment`}
                      className="group"
                      data-cursor-clickable
                    >
                      <h3 className="font-bold text-primary">Alat Kesehatan</h3>
                    </Link>
                    <Link
                      href={`/${locale}/article`}
                      className="group"
                      data-cursor-clickable
                    >
                      <h3 className="font-bold text-primary">Artikel</h3>
                    </Link>
                    <Link
                      href={`/${locale}/events`}
                      className="group"
                      data-cursor-clickable
                    >
                      <h3 className="font-bold text-primary">Acara</h3>
                    </Link>
                    <Link
                      href={`/${locale}/events`}
                      className="group"
                      data-cursor-clickable
                    >
                      <h3 className="font-bold text-primary">Kontak</h3>
                    </Link>
                  </div>

                  <SheetFooter className="bg-gray-50 rounded-2xl border border-primary/10">
                    <h5 className="text-primary font-bold mb-0">Preferensi</h5>
                    <div className="z-9999">
                      <LanguageSwitcher />
                    </div>
                  </SheetFooter>
                </SheetContent>
              </Sheet>
            </div>

            <div className="flex-row items-center flex-wrap gap-10 lg:flex hidden">
              <Link
                href={`/${locale}/about`}
                className="group"
                data-cursor-clickable
              >
                <p className="text-primary">Tentang Kami</p>
              </Link>
              <NavigationMenu>
                <NavigationMenuList>
                  <NavigationMenuItem>
                    <NavigationMenuTrigger>
                      <p className="text-primary">Kesehatan & Medis</p>
                    </NavigationMenuTrigger>
                    <NavigationMenuContent className="w-sm!">
                      <NavigationMenuLink href={`/${locale}/wellness`}>
                        <p className="text-primary font-semibold">
                          Paket Kesehatan
                        </p>
                        <p className="line-clamp-2 text-sm! text-muted-foreground mt-1">
                          Lorem, ipsum dolor sit amet consectetur adipisicing
                          elit. Sequi, adipisci?
                        </p>
                      </NavigationMenuLink>
                      <NavigationMenuLink href={`/${locale}/medical`}>
                        <p className="text-primary font-semibold">
                          Paket Medis
                        </p>
                        <p className="line-clamp-2 text-sm! text-muted-foreground mt-1">
                          Lorem ipsum dolor sit amet, consectetur adipisicing
                          elit. Officiis atque unde sint!
                        </p>
                      </NavigationMenuLink>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>

              <Link
                href={`/${locale}/medical-equipment`}
                className="group"
                data-cursor-clickable
              >
                <p className="text-primary">Alat Kesehatan</p>
              </Link>
              <Link
                href={`/${locale}/article`}
                className="group"
                data-cursor-clickable
              >
                <p className="text-primary">Artikel</p>
              </Link>
              <Link
                href={`/${locale}/events`}
                className="group"
                data-cursor-clickable
              >
                <p className="text-primary">Acara</p>
              </Link>
              <Link
                href={`/${locale}/contact`}
                className="group"
                data-cursor-clickable
              >
                <p className="text-primary">Kontak</p>
              </Link>
              <div>
                <LanguageSwitcher short className="w-fit h-10!" />
              </div>
              <Link href={`/sign-in`} className="group" data-cursor-clickable>
                <Button
                  size={"lg"}
                  className="rounded-full inline-flex items-center font-normal h-10 px-5! pointer-events-auto cursor-pointer"
                >
                  <p>Masuk</p>
                  <LogIn />
                </Button>
              </Link>
            </div>
          </div>
        </header>
      </nav>
    </ContainerWrap>
  );
};

export default NavHeader;
