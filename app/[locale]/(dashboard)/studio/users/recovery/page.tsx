import { getAllVendor } from "@/lib/vendors/get-vendor";
import { Account } from "@/types/account.types";
import React from "react";

import { VendorType } from "@/types/vendor.types";
import Link from "next/link";
import { ChevronDown, ChevronRight, Database, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { createClient } from "@/utils/supabase/server";
import { getAllHotel } from "@/lib/hotel/get-hotel";
import ContainerWrap from "@/components/utility/ContainerWrap";
import { VendorHotelDataTable } from "@/components/vendor-hotel/vendor-hotel-data-table";
import { deleteHotel } from "@/lib/hotel/delete-hotel";
import UnderConstruction from "@/components/utility/under-construction";
import RecoveryPageClient from "./recovery-page-client";

const RecoveryAccountPage = async () => {
  const locale = await getLocale();
  return (
    <ContainerWrap className="pb-[20vh]">
      <RecoveryPageClient locale={locale} />
    </ContainerWrap>
  );
};

export default RecoveryAccountPage;
