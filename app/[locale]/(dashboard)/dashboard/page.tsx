import Wrapper from "@/components/utility/Wrapper";
import { getAuthServer } from "@/lib/auth/auth-server";
import { redirect } from "next/navigation";

const DashboardPage = async () => {
  const auth = await getAuthServer();
  if (!auth) {
    redirect("/sign-in");
  }

  return (
    <Wrapper>
      <p>Dashboard</p>
      <pre>{JSON.stringify(auth, null, 2)}</pre>
    </Wrapper>
  );
};

export default DashboardPage;
