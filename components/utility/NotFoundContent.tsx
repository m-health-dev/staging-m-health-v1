"use client";

import { Button } from "@/components/ui/button";
import ContainerWrap from "@/components/utility/ContainerWrap";
import { ArrowLeft, ChevronDown, ChevronUp, Home } from "lucide-react";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import * as UAParserModule from "ua-parser-js";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { nanoid } from "nanoid";

const NotFoundContent = () => {
  const pathname = usePathname();
  const router = useRouter();
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
          pathname,
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
            errorData ? JSON.parse(errorData) : "No response body"
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
    <ContainerWrap
      size="xxl"
      className="relative flex lg:flex-row flex-col w-full min-h-screen items-center"
    >
      <div className="flex flex-col items-center justify-center min-h-screen w-full">
        <div className="max-w-sm">
          <div className="bg-white border p-4 rounded-3xl">
            <Image
              src={
                "https://irtyvkfjzojdkmtnstmd.supabase.co/storage/v1/object/public/m-health-public/logo/icon_mhealth_logo.PNG"
              }
              width={100}
              height={100}
              unoptimized
              alt="icon-m-health"
              className="object-contain w-12 h-12 mb-3"
            />
            <h3 className="text-primary font-semibold">404 Not Found</h3>
            <p className="text-health">Halaman Tidak Ditemukan</p>
            <p className="text-sm! text-muted-foreground">
              Sepertinya kamu tersesat di jalur yang tidak tersedia.
            </p>
            <div className="flex justify-start items-center gap-3 mt-5">
              <Button
                variant={"outline"}
                className="rounded-2xl"
                onClick={() => router.back()}
              >
                <ArrowLeft />
                Back
              </Button>
              <Button
                className="rounded-2xl"
                onClick={() => router.replace("/")}
              >
                <Home />
                Home
              </Button>
            </div>
          </div>
          <Collapsible
            open={detailsOpen}
            onOpenChange={setDetailsOpen}
            className="mt-2 border rounded-3xl p-4 bg-white w-full"
          >
            <CollapsibleTrigger className="flex items-center justify-between text-primary w-full bg-white h-7">
              <p className="text-sm!">Informasi Teknis</p>
              {detailsOpen ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </CollapsibleTrigger>
            <CollapsibleContent className="pt-2 text-muted-foreground space-y-1">
              <p className="text-xs!">{rayId || "Tidak tersedia"}</p>
              <p className="text-xs!">{dataIP || "Tidak tersedia"}</p>
              <p className="text-xs!">{pathname}</p>
            </CollapsibleContent>
          </Collapsible>
        </div>
      </div>

      <div className="lg:flex hidden">
        <Image
          src={
            "https://hoocfkzapbmnldwmedrq.supabase.co/storage/v1/object/public/m-health-public/dummy/batu_light_trek.jpg"
          }
          width={720}
          height={720}
          alt="404"
          className="w-screen min-h-[calc(100vh-5vh)] max-h-[calc(100vh-5vh)] object-center object-cover rounded-3xl overflow-hidden"
        />
      </div>
    </ContainerWrap>
  );
};

export default NotFoundContent;
