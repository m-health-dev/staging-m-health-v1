"use client";

import { useEffect } from "react";

export default function PublicIDInitializer() {
  useEffect(() => {
    fetch("/api/public-id");
  }, []);

  return null;
}
