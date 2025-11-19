import PackageDetailClient from "@/components/package/PackageDetailClient";
import ContainerWrap from "@/components/utility/ContainerWrap";
import Wrapper from "@/components/utility/Wrapper";
import { getImagePackageDetail } from "@/lib/unsplashImage";
import Image from "next/image";
import React from "react";

const PackageDetailSlug = async () => {
  const data = await getImagePackageDetail("sound healing");
  const img = data.results.slice(0, 5);

  return (
    <Wrapper>
      <PackageDetailClient image={img} gender="male" />
    </Wrapper>
  );
};

export default PackageDetailSlug;
