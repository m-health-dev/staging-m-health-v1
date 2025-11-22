"use client";

import { getAuth } from "@/lib/auth/checkAuth";
import { useEffect } from "react";

const DashboardPage = () => {
  useEffect(() => {
    const checkAuth = async () => {
      const user = await getAuth();

      if (user) {
        console.log("User sudah login:", user);
      } else {
        console.log("User belum login");
      }
    };

    checkAuth();
  }, []);

  return <p>Dashboard</p>;
};

export default DashboardPage;
