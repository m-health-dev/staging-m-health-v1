import type React from "react";
import { cn } from "@/lib/utils";

import container from "@/app/css/container.module.css";

const ContainerWrap = ({
  children,
  className,
  type = "default",
  size = "xl",
}: {
  className?: string;
  children: React.ReactNode;
  type?: "carousel" | "default";
  size?: "sm" | "md" | "lg" | "xl" | "xxl";
}) => {
  const sizeClasses = {
    sm: `${container.sm}`,
    md: `${container.md}`,
    lg: `${container.lg}`,
    xl: `${container.xl}`,
    xxl: `${container.xxl}`,
  };

  const sizeClassesCarousel = {
    sm: `${container.car_sm}`,
    md: `${container.car_md}`,
    lg: `${container.car_lg}`,
    xl: `${container.car_xl}`,
    xxl: `${container.car_xxl}`,
  };

  return (
    <div
      className={cn(
        type === "default" ? sizeClasses[size] : sizeClassesCarousel[size],
        className
      )}
    >
      {children}
    </div>
  );
};

export default ContainerWrap;
