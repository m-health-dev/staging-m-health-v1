import ChatContent from "@/components/chatbot/ChatContent";
import ContainerWrap from "@/components/utility/ContainerWrap";
import NavHeader from "@/components/utility/header/NavHeader";
import { getImage } from "@/lib/unsplashImage";
import { getTranslations } from "next-intl/server";
import Image from "next/image";

export default async function Home() {
  return (
    <>
      <NavHeader />
      <ChatContent />
    </>
  );
}
