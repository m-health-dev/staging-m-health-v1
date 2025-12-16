import { getUserDetail } from "@/lib/auth/getUserDetail";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Account } from "@/types/account.types";
import Avatar from "boring-avatars";

const AvatarUserDetail = ({ id }: { id: string }) => {
  const [data, setData] = useState<Account>();

  useEffect(() => {
    const fetch = async () => {
      const data = await getUserDetail(id);
      setData(data);
    };

    fetch();
  }, []);

  console.log(data);

  return data?.avatar_url || data?.google_avatar ? (
    <Image
      src={data?.avatar_url || data?.google_avatar}
      alt={data?.fullname}
      width={100}
      height={100}
    />
  ) : (
    <Avatar
      name={data?.fullname}
      className="w-10! h-10!"
      colors={["#3e77ab", "#22b26e", "#f2f26f", "#fff7bd", "#95cfb7"]}
      variant="beam"
      size={20}
    />
  );
};
export default AvatarUserDetail;
