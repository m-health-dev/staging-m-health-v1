"use client";

import { Button } from "@/components/ui/button";
import ContainerWrap from "@/components/utility/ContainerWrap";
import { ArrowLeft, ChevronDown, ChevronUp, Home } from "lucide-react";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import * as UAParserModule from "ua-parser-js";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { nanoid } from "nanoid";
import { routing } from "@/i18n/routing";

type NotFoundContentProps = {
  locale?: string;
  messageNoData?: boolean;
};

const NotFoundContent = ({
  locale: localeProp,
  messageNoData = false,
}: NotFoundContentProps) => {
  const pathname = usePathname();
  const router = useRouter();
  const params = useSearchParams();

  // Detect locale from pathname or use prop or default to "en"
  const detectedLocale = pathname?.split("/")[1];
  const isValidLocale = routing.locales.includes(detectedLocale as any);
  const locale = localeProp || (isValidLocale ? detectedLocale : "en");
  const [rayId, setRayId] = useState("");
  const [dataIP, setDataIP] = useState("");
  const [hasLogged, setHasLogged] = useState(false);
  const [geoData, setGeoData] = useState<{ ip: string; geo: any } | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorData, setErrorData] = useState<string | null>(null);
  const [isDevelopment, setIsDevelopment] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);

  const handleBack = () => {
    router.back();
  };

  const fetchGeoData = async () => {
    setErrorData(null);
    try {
      const response = await fetch("/api/geo");
      if (!response.ok) {
        throw new Error("Failed to fetch geolocation data");
      }
      const data = await response.json();
      setGeoData(data);
      setIsDevelopment(data.ip === "127.0.0.1");

      // Log error after getting geo data
      await logNotFound(data);
    } catch (err) {
      setErrorData("An error occurred while fetching geolocation data");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const logNotFound = async (geoData: any) => {
    try {
      if (hasLogged) return;

      const errorCodeNote = "404 : Not Found";
      const errorMessage = "Page Not Found";

      const genNanoID = nanoid();

      const newRayId = geoData.geo.cfray ? geoData.geo.cfray : genNanoID;
      const ipAddress = geoData.geo.cfip ? geoData.geo.cfip : "N/A";
      const browserInfo = getBrowserInfo();

      const response = await fetch("/api/log-errors", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          pathname:
            pathname + (params.toString() ? "?" + params.toString() : ""),
          rayId: newRayId,
          error_code: errorCodeNote,
          error_message: errorMessage,
          ipAddress,
          browserInfo,
        }),
      });

      if (response.ok) {
        setRayId(newRayId);
        setDataIP(ipAddress);
        setHasLogged(true);
      } else {
        // Safely handle the error response
        try {
          const errorData = await response.text();
          console.log(
            "Error inserting data:",
            errorData ? JSON.parse(errorData) : "No response body",
          );
        } catch (parseError) {
          console.log("Error parsing error response:", parseError);
          console.log("Original error status:", response.status);
        }
      }
    } catch (error) {
      console.log("Error logging not found:", error);
    }
  };

  function getBrowserInfo() {
    const parser = new UAParserModule.UAParser();
    const result = parser.getResult();
    return {
      browser: `${result.browser.name} ${result.browser.version}`,
      os: `${result.os.name} ${result.os.version}`,
      device: result.device.type || "Desktop",
    };
  }

  useEffect(() => {
    fetchGeoData();
  }, []);

  return (
    <ContainerWrap size="xxl" className="">
      <div className="flex flex-col items-center justify-center min-h-[92vh] w-full">
        <div className="max-w-md">
          <div className="flex flex-col lg:items-center items-start lg:text-center text-start">
            <Image
              src={
                "https://hoocfkzapbmnldwmedrq.supabase.co/storage/v1/object/public/m-health-public/static/mhealth_logo_crop.PNG"
              }
              width={100}
              height={100}
              unoptimized
              alt="icon-m-health"
              className="object-contain w-12 h-12 mb-3"
            />
            <h3 className="text-primary font-semibold">
              {locale === routing.defaultLocale
                ? "Halaman Tidak Ditemukan"
                : "Page Not Found"}
            </h3>
            {/* <p className="text-health">
              {locale === routing.defaultLocale
                ? "Halaman Tidak Ditemukan"
                : "Page Not Found"}
            </p> */}
            <p className="text-sm! text-muted-foreground mt-2">
              {locale === routing.defaultLocale
                ? "Sepertinya halaman yang kamu cari tidak tersedia atau mungkin sudah dipindahkan."
                : "It seems the page you're looking for isn't available or may have been moved."}
            </p>
            <div className="flex justify-start items-center gap-3 mt-5">
              <Button
                variant={"outline"}
                className="rounded-2xl"
                onClick={() => router.back()}
              >
                <ArrowLeft />
                {locale === routing.defaultLocale ? "Kembali" : "Back"}
              </Button>
              <Button
                className="rounded-2xl"
                onClick={() => window.location.replace("/home")}
              >
                <Home />
                {locale === routing.defaultLocale ? "Beranda" : "Home"}
              </Button>
            </div>
          </div>

          <div className="mt-5">
            {messageNoData && (
              <div className="mb-2 p-4 bg-white text-gray-400 border border-gray-400 rounded-3xl">
                <p className="font-semibold mb-1">
                  {locale === routing.defaultLocale
                    ? "Maaf atas ketidaknyamanan ini,"
                    : "Sorry for the inconvenience,"}
                </p>
                <p className="text-sm!">
                  {locale === routing.defaultLocale
                    ? "Data ini sudah tidak ada dalam data kami/ sudah diarsipkan."
                    : "This data is no longer in our data/ has been archived."}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="text-muted-foreground! flex lg:justify-center justify-start w-full gap-1 my-2">
        <p className="text-xs!">
          {rayId ||
            (locale === routing.defaultLocale
              ? "Tidak tersedia"
              : "Not available")}{" "}
          -{" "}
          {dataIP ||
            (locale === routing.defaultLocale
              ? "Tidak tersedia"
              : "Not available")}
        </p>
      </div>
    </ContainerWrap>
  );
};

export default NotFoundContent;
