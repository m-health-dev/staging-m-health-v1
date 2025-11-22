import Wrapper from "@/components/utility/Wrapper";
import { getAuthServer } from "@/lib/auth/auth-server";

const DashboardPage = async () => {
  const auth = await getAuthServer();

  return (
    <Wrapper>
      <p>Dashboard</p>
      <pre>{JSON.stringify(auth, null, 2)}</pre>
    </Wrapper>
  );
};

export default DashboardPage;
