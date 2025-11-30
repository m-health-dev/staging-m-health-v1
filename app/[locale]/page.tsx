import ChatContent from "@/components/chatbot/ChatContent";
import Footer from "@/components/utility/footer/Footer";
import NavHeader from "@/components/utility/header/NavHeader";
import { getAllMedical, getLatest3Medical } from "@/lib/medical/getMedical";
import { getAllPackages, getLatest3Packages } from "@/lib/packages/getPackages";
import { getLatest3Wellness } from "@/lib/wellness/getWellness";

export default async function Home() {
  const { data: packages } = await getLatest3Packages();
  const { data: medical } = await getLatest3Medical();
  const { data: wellness } = await getLatest3Wellness();
  // console.log("Packages Data:", data);
  return (
    <>
      <NavHeader />
      <ChatContent packages={packages} medical={medical} wellness={wellness} />
    </>
  );
}
