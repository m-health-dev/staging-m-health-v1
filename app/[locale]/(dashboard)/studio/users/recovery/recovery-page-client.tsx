"use client";

import React from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";
import type { RecoveryAccountRow } from "@/lib/users/recovery/get-set-recovery-users";
import { toast } from "sonner";
import { routing } from "@/i18n/routing";
import LocalDateTime from "@/components/utility/lang/LocaleDateTime";

const RecoveryPageClient = ({ locale }: { locale: string }) => {
  const [searchEmail, setSearchEmail] = React.useState("");
  const [data, setData] = React.useState<RecoveryAccountRow | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [resetting, setResetting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const canReset = data?.request === 3;

  const handleSearch = async (event?: React.FormEvent) => {
    event?.preventDefault();

    const email = searchEmail.trim();
    setError(null);
    setData(null);

    if (!email) {
      setError("Email is required.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(
        `/api/recovery-users/${encodeURIComponent(email)}`
      );
      const json = await res.json();

      if (!res.ok || !json?.success) {
        const msg =
          json?.error || json?.message || "Failed to fetch recovery user.";
        setError(msg);
        toast.error(msg);
        return;
      }

      if (!json.data) {
        const msg = "No recovery record found for that email.";
        setError(msg);
        toast.message(msg);
        return;
      }

      setData(json.data as RecoveryAccountRow);
    } catch (e) {
      setError(String(e));
      toast.error("Failed to fetch recovery user.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async () => {
    if (!data?.id) return;

    setError(null);
    setResetting(true);
    try {
      const res = await fetch(
        `/api/recovery-users/${encodeURIComponent(data.id)}`,
        { method: "POST" }
      );
      const json = await res.json();

      if (!res.ok || !json?.success) {
        const msg =
          json?.error || json?.message || "Failed to reset recovery user.";
        setError(msg);
        toast.error(msg);
        return;
      }

      setData((json.data as RecoveryAccountRow) ?? null);
      toast.success("Recovery request reset.");
    } catch (e) {
      setError(String(e));
      toast.error("Failed to reset recovery request.");
    } finally {
      setResetting(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 my-20">
      <div>
        <div>
          <h3 className="font-bold text-primary">
            {locale === routing.defaultLocale
              ? "Cari Akun untuk Dipulihkan"
              : "Search Account to Recovery"}
          </h3>
          <p className="text-sm! text-muted-foreground mb-4">
            {locale === routing.defaultLocale
              ? "Masukkan email kemudian klik reset."
              : "Just input the email then click reset."}
          </p>
        </div>
        <div>
          <form onSubmit={handleSearch} className="flex gap-3 max-w-md">
            <Input
              value={searchEmail}
              onChange={(e) => setSearchEmail(e.target.value)}
              placeholder="Recovery Email"
              autoComplete="off"
              className="h-12"
            />
            <Button
              type="submit"
              className="rounded-2xl h-12"
              disabled={loading}
            >
              {loading ? <Spinner className="size-4" /> : "Search"}
            </Button>
          </form>

          {error ? <p className="text-sm! text-red-600 mt-3">{error}</p> : null}
        </div>
      </div>

      {data ? (
        <Card>
          <CardHeader>
            <h6 className="text-primary font-bold">Result</h6>
            <p className="text-sm! text-muted-foreground">
              Reset button is enabled only when request = 3.
            </p>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex flex-col gap-1">
              <p className="text-sm! text-muted-foreground">ID</p>
              <p className="font-medium break-all">{data.id}</p>
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-sm! text-muted-foreground">Email</p>
              <p className="font-medium break-all">{data.email}</p>
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-sm! text-muted-foreground">Request</p>
              <p
                className={cn(
                  "font-medium",
                  data.request === 3 ? "text-primary" : "text-muted-foreground"
                )}
              >
                {data.request}
              </p>
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-sm! text-muted-foreground">Last Updated</p>
              <p className="font-medium">
                {data.updated_at ? (
                  <LocalDateTime date={data.updated_at} />
                ) : (
                  "-"
                )}
              </p>
            </div>
          </CardContent>
          <CardFooter className="gap-3">
            <Button
              className="rounded-full"
              onClick={handleReset}
              disabled={!canReset || resetting}
            >
              {resetting ? (
                <span className="inline-flex items-center gap-2">
                  <Spinner className="size-4" /> Resetting
                </span>
              ) : (
                "Reset"
              )}
            </Button>
            {!canReset ? (
              <p className="text-sm! text-muted-foreground">
                Reset is only allowed when request = 3.
              </p>
            ) : null}
          </CardFooter>
        </Card>
      ) : null}
    </div>
  );
};

export default RecoveryPageClient;
