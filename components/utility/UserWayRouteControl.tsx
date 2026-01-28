"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

const HIDDEN_ROUTES = ["/studio"];

function removeLocale(pathname: string) {
  // removes first segment like /en or /id
  const segments = pathname.split("/");
  if (segments.length > 2) {
    return "/" + segments.slice(2).join("/");
  }
  return "/";
}

export default function UserwayRouteControl() {
  const pathname = usePathname();

  useEffect(() => {
    const controlWidget = () => {
      if (!window.UserWay) return;

      const cleanPath = removeLocale(pathname);

      const shouldHide = HIDDEN_ROUTES.some((route) =>
        cleanPath.startsWith(route),
      );

      if (shouldHide) {
        window.UserWay.iconVisibilityOff();
      } else {
        window.UserWay.iconVisibilityOn();
      }
    };

    controlWidget();
    document.addEventListener("userway:init_completed", controlWidget);

    return () => {
      document.removeEventListener("userway:init_completed", controlWidget);
    };
  }, [pathname]);

  return null;
}
