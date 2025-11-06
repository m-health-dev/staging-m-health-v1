import type React from "react";
import { cn } from "@/lib/utils";

import container from "@/app/css/container.module.css";

const ContainerWrap = ({
  children,
  className,
  size = "xl",
}: {
  className?: string;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl" | "xxl";
}) => {
  const sizeClasses = {
    sm: `${container.sm}`,
    md: `${container.md}`,
    lg: `${container.lg}`,
    xl: `${container.xl}`,
    xxl: `${container.xxl}`,
  };

  return <div className={cn(sizeClasses[size], className)}>{children}</div>;
};

export default ContainerWrap;
