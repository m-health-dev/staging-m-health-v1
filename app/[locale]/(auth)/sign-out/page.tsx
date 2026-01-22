"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, LogOut } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { toast } from "sonner";
import { locale } from "dayjs";
import { useLocale } from "next-intl";
import { routing } from "@/i18n/routing";

export default function SignOutPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const locale = useLocale();

  const handleSignOut = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signOut();

      if (error) {
        throw error;
      }

      toast.success(
        locale === routing.defaultLocale
          ? "Kamu Berhasil Keluar!"
          : "You have successfully signed out!"
      );

      // Redirect to login page after successful sign out
      router.push("/?sign_out=success");
    } catch (err: any) {
      setError(err.message || "An error occurred while signing out");
      toast.error(
        locale === routing.defaultLocale
          ? "Yah, Kamu Tidak Berhasil Keluar"
          : "Oops, you failed to sign out",
        {
          description: err.message || "An error occurred while signing out",
        }
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
      <Card className="w-full max-w-md shadow-none">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold text-primary">
            <h4>{locale === routing.defaultLocale ? "Keluar" : "Sign Out"}</h4>
          </CardTitle>
          <CardDescription>
            <p>
              {locale === routing.defaultLocale
                ? "Apakah kamu yakin ingin keluar dari akunmu?"
                : "Are you sure you want to sign out of your account?"}
            </p>
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <p className="text-sm! text-muted-foreground">
            {locale === routing.defaultLocale
              ? "Kamu akan perlu masuk kembali untuk mengakses akunmu."
              : "You will need to sign in again to access your account."}
          </p>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button
            variant="outline"
            className="rounded-full"
            onClick={handleCancel}
            disabled={isLoading}
          >
            {locale === routing.defaultLocale ? "Batal" : "Cancel"}
          </Button>
          <Button
            variant="destructive"
            onClick={handleSignOut}
            disabled={isLoading}
            className="gap-2 rounded-full px-5!"
          >
            {isLoading
              ? locale === routing.defaultLocale
                ? "Keluar..."
                : "Signing out..."
              : locale === routing.defaultLocale
              ? "Keluar"
              : "Sign Out"}
            {!isLoading && <LogOut className="h-4 w-4" />}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
