"use client";

import { useEffect, useState } from "react";

export function usePublicID(initialPublicID: string | undefined) {
  const [publicID, setPublicID] = useState<string>(initialPublicID || "");
  const [isLoading, setIsLoading] = useState(!initialPublicID);

  useEffect(() => {
    if (!initialPublicID) {
      const generatePublicID = async () => {
        try {
          const response = await fetch("/api/public-id");
          const data = await response.json();
          setPublicID(data.publicID);
        } catch (error) {
          console.error("Error generating public ID:", error);
        } finally {
          setIsLoading(false);
        }
      };
      generatePublicID();
    }
  }, [initialPublicID]);

  return { publicID, isLoading };
}
