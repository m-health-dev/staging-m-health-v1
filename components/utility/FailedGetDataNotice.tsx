import { MessageCircleWarning } from "lucide-react";
import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";
import React from "react";
import ContainerWrap from "./ContainerWrap";

const FailedGetDataNotice = ({
  size = "lg",
}: {
  size?: "sm" | "md" | "lg";
}) => {
  const t = useTranslations("FailedNotice");

  if (size === "sm") {
    return (
      <div className="bg-yellow-100 border border-yellow-600 p-3 rounded-2xl flex flex-col gap-2">
        <div className="bg-white w-10 h-10 flex items-center justify-center rounded-full border border-yellow-600">
          <MessageCircleWarning className="text-yellow-600" />
        </div>
        <div>
          <p className="text-yellow-600 font-bold text-base!">{t("title")}</p>
          <p className="text-yellow-600 text-sm!">{t("desc")}</p>
        </div>
      </div>
    );
  }
  if (size === "md") {
    return (
      <div className="bg-yellow-100 border border-yellow-600 p-5 rounded-2xl my-10 flex items-center gap-3">
        <div className="bg-white w-14 h-14 flex items-center justify-center rounded-full border border-yellow-600">
          <MessageCircleWarning className="text-yellow-600" />
        </div>
        <div>
          <h6 className="text-yellow-600 font-bold">{t("title")}</h6>
          <p className="text-yellow-600">{t("desc")}</p>
        </div>
      </div>
    );
  }
  if (size === "lg") {
    return (
      <div className="bg-yellow-100 border border-yellow-600 p-5 rounded-2xl my-10 flex lg:flex-row flex-col lg:items-center gap-3">
        <div className="bg-white w-14 h-14 flex items-center justify-center rounded-full border border-yellow-600">
          <MessageCircleWarning className="text-yellow-600" />
        </div>
        <div>
          <h6 className="text-yellow-600 font-bold">{t("title")}</h6>
          <p className="text-yellow-600">{t("desc")}</p>
        </div>
      </div>
    );
  }
};

export default FailedGetDataNotice;
