import ChatContent from "@/components/chatbot/ChatContent";
import Footer from "@/components/utility/footer/Footer";
import NavHeader from "@/components/utility/header/NavHeader";
import { getAllPackages } from "@/lib/packages/getPackages";

export default async function Home() {
  const { data } = await getAllPackages();
  // console.log("Packages Data:", data);
  return (
    <>
      <NavHeader />
      <ChatContent data={data} />
    </>
  );
}
