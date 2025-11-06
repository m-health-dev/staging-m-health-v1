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
import { X } from "lucide-react";

const NavHeader = () => {
  return (
    <nav className="sticky top-0 px-5 bg-background z-99">
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
                <SheetFooter className="p-0!">
                  <div>
                    <h6 className="text-primary font-bold mb-2">Preferensi</h6>
                    <LanguageSwitcher />
                  </div>
                </SheetFooter>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>
    </nav>
  );
};

export default NavHeader;
