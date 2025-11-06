"use client";

import { ChevronDown, ChevronRight, Plus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Suspense, useEffect, useState } from "react";
import ChatStart from "./ChatStart";
import { useRouter } from "next/navigation";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import ContainerWrap from "../utility/ContainerWrap";
import {
  get5ImageEvents,
  get5ImageMedical,
  get5ImageWellness,
} from "@/lib/unsplashImage";
import Image from "next/image";
import { Button } from "../ui/button";
import Link from "next/link";
import { Spinner } from "../ui/spinner";
import { useResponsiveSidebar } from "@/hooks/ChatSidebar";

const ChatContent = () => {
  const [imageWellness, setImageWellness] = useState<any[]>([]);
  const [imageMedical, setImageMedical] = useState<any[]>([]);
  const [imageEvents, setImageEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const { isSidebarOpen, setIsSidebarOpen } = useResponsiveSidebar();

  const [showSidebarContent, setShowSidebarContent] = useState(true);

  useEffect(() => {
    const imageData = async () => {
      setLoading(true);
      try {
        const resWel = await get5ImageWellness();

        if (!resWel) throw new Error("Failed to Fetch 5 Images");
        setImageWellness(resWel.results);

        const resMed = await get5ImageMedical();

        if (!resMed) throw new Error("Failed to Fetch 5 Images");
        setImageMedical(resMed.results);

        const resEv = await get5ImageEvents();

        if (!resEv) throw new Error("Failed to Fetch 5 Images");
        setImageEvents(resEv.results);
        setLoading(false);
      } catch (error: any) {
        if (error) {
          throw new Error("Undefined Error!");
        }
        setLoading(false);
      }
    };

    imageData();
  }, []);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (!isSidebarOpen) {
      // Saat tutup: hilangkan konten dulu
      setShowSidebarContent(false);
      // Setelah 400ms (fade out selesai), baru tutup sidebar
      timer = setTimeout(() => {
        setIsSidebarOpen(false);
      }, 400);
    }

    return () => clearTimeout(timer);
  }, [isSidebarOpen]);

  // Handler toggle
  const toggleSidebar = () => {
    if (isSidebarOpen) {
      // Saat menutup → jalankan urutan di atas
      setShowSidebarContent(false);
      setIsSidebarOpen(false);
    } else {
      // Saat membuka → buka lebar dulu baru isi muncul
      setIsSidebarOpen(true);
      setShowSidebarContent(true);
    }
  };

  return (
    <div className="flex lg:flex-row flex-col lg:flex-wrap lg:min-h-[calc(100vh-13.5vh)] 3xl:min-h-[calc(100vh-8vh)]">
      <div className="lg:flex hidden">
        <div className="flex flex-row items-start gap-2">
          <motion.div
            animate={{ width: isSidebarOpen ? 380 : 0 }}
            transition={{
              duration: 0.4,
              ease: "easeInOut",
            }}
            style={{ willChange: "width" }}
            className="bg-white 3xl:max-h-[calc(100vh-8vh)] 3xl:min-h-[calc(100vh-8vh)] lg:max-h-[calc(100vh-13.5vh)] lg:min-h-[calc(100vh-13.5vh)] max-h-[calc(100vh-8vh)] min-h-[calc(100vh-8vh)] overflow-y-auto hide-scroll rounded-2xl ml-5 shadow-sm overflow-hidden flex flex-col lg:max-w-5/6 max-w-4/6"
          >
            {/* Header */}
            <div className="px-4 flex justify-between items-start gap-4 md:w-[380px] w-[300px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key="sidebar-content"
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.3,
                    delay: 0.3, // ⏱️ delay 1 detik sebelum muncul
                    ease: "easeOut",
                  }}
                  className="flex flex-col"
                >
                  {loading ? (
                    <div className="flex w-full max-h-[calc(100vh-13.5vh)] min-h-[calc(100vh-13.5vh)] justify-center items-center">
                      <Spinner className="text-primary" />
                    </div>
                  ) : (
                    <div className="flex flex-col">
                      <h4 className="font-bold text-primary sticky top-0 bg-white py-5">
                        Welness
                      </h4>
                      <div className="space-y-5">
                        {imageWellness.map((img, i) => (
                          <Link
                            key={img.id}
                            href={`/wellness/package-${i + 1}`}
                            className="group"
                          >
                            <div className="grid grid-cols-3 items-center group-hover:bg-muted group-hover:shadow-sm transition-all duration-300 rounded-xl py-3 border border-border mb-5">
                              <div className="col-span-1 px-3">
                                <Suspense fallback={<Spinner />}>
                                  <Image
                                    src={img.full}
                                    alt={img.alt}
                                    width={720}
                                    height={720}
                                    className="aspect-square object-cover object-center rounded-xl"
                                  />
                                </Suspense>
                              </div>
                              <div className="col-span-2">
                                <h6 className="font-bold text-primary line-clamp-3 ">
                                  Package item {i + 1} by. {i + 5 * 3} Hospital
                                  in Bali
                                </h6>
                              </div>
                              <div className="col-span-3 mt-2 px-3">
                                <p className="text-sm! text-muted-foreground line-clamp-2">
                                  Lorem ipsum dolor sit amet consectetur
                                  adipisicing elit. Suscipit tenetur cum vel,
                                  adipisci provident, voluptas magnam veniam
                                  saepe ut ipsum aut veritatis voluptatum
                                  quisquam pariatur vero consequatur? Possimus,
                                  fugiat minima?
                                </p>
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                      <h4 className="font-bold text-primary sticky top-0 bg-white py-5">
                        Medical
                      </h4>
                      <div className="space-y-5">
                        {imageMedical.map((img, i) => (
                          <Link
                            key={img.id}
                            href={`/wellness/package-${i + 1}`}
                            className="group"
                          >
                            <div className="grid grid-cols-3 items-center group-hover:bg-muted group-hover:shadow-sm transition-all duration-300 rounded-xl py-3  border border-border mb-5">
                              <div className="col-span-1 px-3">
                                <Image
                                  src={img.full}
                                  alt={img.alt}
                                  width={720}
                                  height={720}
                                  className="aspect-square object-cover object-center rounded-xl"
                                />
                              </div>
                              <div className="col-span-2">
                                <h6 className="font-bold text-primary line-clamp-3 ">
                                  Package item {i + 1} by. {i + 5 * 3} Hospital
                                  in Bali
                                </h6>
                              </div>
                              <div className="col-span-3 mt-2 px-3">
                                <p className="text-sm! text-muted-foreground line-clamp-2">
                                  Lorem ipsum dolor sit amet consectetur
                                  adipisicing elit. Suscipit tenetur cum vel,
                                  adipisci provident, voluptas magnam veniam
                                  saepe ut ipsum aut veritatis voluptatum
                                  quisquam pariatur vero consequatur? Possimus,
                                  fugiat minima?
                                </p>
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                      <h4 className="font-bold text-primary sticky top-0 bg-white py-5">
                        Events
                      </h4>
                      <div className="space-y-5">
                        {imageEvents.map((img, i) => (
                          <Link
                            key={img.id}
                            href={`/wellness/package-${i + 1}`}
                            className="group"
                          >
                            <div className="grid grid-cols-3 items-center group-hover:bg-muted group-hover:shadow-sm transition-all duration-300 rounded-xl py-3  border border-border mb-5">
                              <div className="col-span-1 px-3">
                                <Image
                                  src={img.full}
                                  alt={img.alt}
                                  width={720}
                                  height={720}
                                  className="aspect-square object-cover object-center rounded-xl"
                                />
                              </div>
                              <div className="col-span-2">
                                <h6 className="font-bold text-primary line-clamp-3 ">
                                  Package item {i + 1} by. {i + 5 * 3} Hospital
                                  in Bali
                                </h6>
                              </div>
                              <div className="col-span-3 mt-2 px-3">
                                <p className="text-sm! text-muted-foreground line-clamp-2">
                                  Lorem ipsum dolor sit amet consectetur
                                  adipisicing elit. Suscipit tenetur cum vel,
                                  adipisci provident, voluptas magnam veniam
                                  saepe ut ipsum aut veritatis voluptatum
                                  quisquam pariatur vero consequatur? Possimus,
                                  fugiat minima?
                                </p>
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
          <div
            className={`flex flex-col space-y-2 transition-all duration-700 ${
              isSidebarOpen ? "ml-0" : "-ml-2"
            } `}
          >
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={toggleSidebar}
                  className="bg-white text-primary rounded-2xl shadow-sm h-12 w-full px-3 flex items-center justify-between transition-all duration-300 relative z-50 pointer-events-auto cursoir-pointer"
                >
                  <ChevronRight
                    className={`${
                      isSidebarOpen ? "rotate-180" : "rotate-0"
                    } transition-all duration-500`}
                  />
                </button>
              </TooltipTrigger>
              <TooltipContent
                side="right"
                className="bg-white text-primary font-medium"
              >
                <p>{isSidebarOpen ? "Tutup Menu" : "Buka Menu"}</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={() => window.location.reload()}
                  className="bg-white text-primary rounded-2xl shadow-sm h-12 w-full px-3 flex items-center justify-between transition-all duration-300 relative z-50 pointer-events-auto cursoir-pointer"
                >
                  <Plus />
                </button>
              </TooltipTrigger>
              <TooltipContent
                side="right"
                className="bg-white text-primary font-medium"
              >
                <p>Mulai Obrolan Baru</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
      </div>

      <ContainerWrap
        size="xxl"
        className={`md:flex-1 transition-all duration-300 translate-x-0 ${
          !isSidebarOpen ? "lg:-translate-x-10" : "lg:translate-x-0"
        }`}
      >
        <ChatStart isSidebarOpen={isSidebarOpen} />
      </ContainerWrap>
    </div>
  );
};

export default ChatContent;
