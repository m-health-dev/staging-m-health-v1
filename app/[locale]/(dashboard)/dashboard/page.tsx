import { getAuth } from "@/lib/auth/checkAuth";
import React from "react";

const DashboardPage = async () => {
  const auth = await getAuth();
  return (
    <div>
      <pre>{JSON.stringify(auth, null, 2)}</pre>
    </div>
  );
};

export default DashboardPage;
