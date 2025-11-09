import ChatContent from "@/components/chatbot/ChatContent";
import Footer from "@/components/utility/footer/Footer";
import NavHeader from "@/components/utility/header/NavHeader";

export default async function Home() {
  return (
    <>
      <NavHeader />
      <ChatContent />
    </>
  );
}
