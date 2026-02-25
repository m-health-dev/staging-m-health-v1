import { getLocale } from "next-intl/server";
import React from "react";
import AccountClientForm from "./account-client-form";
import { getUserInfo } from "@/lib/auth/getUserInfo";
import { getAccessToken } from "../../(auth)/actions/auth.actions";
import { routing } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const AccountPage = async () => {
  const locale = await getLocale();

  const accessToken = await getAccessToken();
  const account = await getUserInfo(accessToken!);
  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="my-20 text-primary font-bold">
        {locale === routing.defaultLocale
          ? "Pengaturan Akun"
          : "Account Settings"}
      </h2>
      <AccountClientForm locale={locale} account={account} />
      <div className="bg-white p-4 rounded-2xl border my-20">
        <h5 className="font-bold text-primary">
          {locale === routing.defaultLocale
            ? "Reset Kata Sandi"
            : "Reset Password"}
        </h5>
        <p className="mt-2 mb-5 text-muted-foreground">
          {locale === routing.defaultLocale
            ? "Anda dapat melakukan pengaturan ulang kata sandi akun Anda dengan mengklik tautan di bawah ini."
            : "You can reset your account password by clicking the link below."}
        </p>
        <Link href={"/reset-password"}>
          <Button className="h-12 rounded-full">
            {locale === routing.defaultLocale
              ? "Reset Kata Sandi"
              : "Reset Password"}
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default AccountPage;
