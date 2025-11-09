import React from "react";
import Image from "next/image";
import { LanguageSwitcher } from "../lang/LanguageSwitcher";
import { useLocale } from "next-intl";

const Footer = () => {
  const buildId = process.env.VERCEL_GIT_COMMIT_SHA;
  const deployId = process.env.VERCEL_DEPLOYMENT_ID;
  const locale = useLocale();
  return (
    <div className="py-[2vh] px-5 w-full">
      <div className="flex justify-center items-center">
        <div className="flex flex-col items-center justify-center w-fit rounded-full">
          <Image
            src={"/vyg.png"}
            alt="vyg.re"
            width={50}
            height={10}
            className="rounded-full"
          />
          <p className="text-xs! text-muted-foreground uppercase py-1 px-3 font-mono mt-2">
            {buildId?.slice(0, 8) || "Local Build"} -{" "}
            {deployId?.split("_")[1].slice(0, 8) || "Local Deploy"} - {locale}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Footer;
