"use client";

import {
  IconCreditCard,
  IconDotsVertical,
  IconLogout,
  IconNotification,
  IconUserCircle,
} from "@tabler/icons-react";

// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import Image from "next/image";
import { Account } from "@/types/account.types";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import dynamic from "next/dynamic";
import { use, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";
import { routing } from "@/i18n/routing";
import { Button } from "./ui/button";
import { Spinner } from "./ui/spinner";
import Link from "next/link";
import { cn } from "@/lib/utils";

const Avatar = dynamic(() => import("boring-avatars"), {
  ssr: false,
});

export function NavUser({
  user,
  type,
  locale,
}: {
  user: Account;
  type?: "header" | "side";
  locale: string;
}) {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
          : "Signed out successfully!"
      );

      // Redirect to login page after successful sign out
      router.refresh();
    } catch (err: any) {
      setError(err.message || "An error occurred while signing out");
      toast.error(
        locale === routing.defaultLocale
          ? "Yah, Kamu Tidak Berhasil Keluar"
          : "Failed to sign out",
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
    <SidebarMenu>
      <SidebarMenuItem className="px-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div
              className={cn(
                type === "side"
                  ? "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible::bg-sidebar-accent focus-visible::text-sidebar-accent-foreground rounded-2xl! focus:outline focus-visible:outline hover:outline px-2 py-2 flex gap-3 items-center w-full"
                  : ""
              )}
            >
              {user.avatar_url ? (
                <Image
                  src={user.avatar_url}
                  height={100}
                  width={100}
                  alt={user.fullname}
                  className="aspect-square object-cover w-10 h-10 rounded-full"
                />
              ) : user.google_avatar ? (
                <Image
                  src={user.google_avatar}
                  height={100}
                  width={100}
                  alt={user.fullname}
                  className="aspect-square object-cover w-10 h-10 rounded-full"
                />
              ) : (
                <Avatar
                  name={user.fullname}
                  className="w-10! h-10!"
                  colors={[
                    "#3e77ab",
                    "#22b26e",
                    "#f2f26f",
                    "#fff7bd",
                    "#95cfb7",
                  ]}
                  variant="beam"
                  size={20}
                />
              )}
              {type === "side" && (
                <>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium">
                      {user.fullname}
                    </span>
                    <span className="text-muted-foreground truncate text-xs">
                      {user.email}
                    </span>
                  </div>
                  <IconDotsVertical className="ml-auto size-4" />
                </>
              )}
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-2xl z-999"
            side={"bottom"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                {user.google_avatar || user.avatar_url ? (
                  <Image
                    src={user.avatar_url || user.google_avatar!}
                    height={100}
                    width={100}
                    alt={user.fullname}
                    className="aspect-square object-cover w-10 h-10 rounded-full"
                  />
                ) : (
                  <Avatar
                    name={user.fullname}
                    className="w-10! h-10!"
                    colors={[
                      "#3e77ab",
                      "#22b26e",
                      "#f2f26f",
                      "#fff7bd",
                      "#95cfb7",
                    ]}
                    variant="beam"
                    size={20}
                  />
                )}
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <p className="truncate font-medium text-sm!">
                    {user.fullname}
                  </p>
                  <p className="text-muted-foreground truncate text-xs!">
                    {user.email}
                  </p>
                </div>
              </div>
            </DropdownMenuLabel>

            <DropdownMenuGroup>
              <DropdownMenuItem className="py-2">
                <Link
                  href={`/account?id=${user.id}`}
                  className="flex items-center gap-2"
                >
                  <IconUserCircle />
                  <p className="text-sm! text-muted-foreground">
                    Pengaturan Akun
                  </p>
                </Link>
              </DropdownMenuItem>
            </DropdownMenuGroup>

            <Dialog>
              <DialogTrigger className="flex items-center gap-2 px-2.5 py-2 hover:bg-red-50 hover:ring ring-inset hover:ring-red-400 w-full rounded-lg group/out transition-all duration-200 hover:cursor-pointer">
                <IconLogout className="size-4 text-muted-foreground group-hover/out:text-red-500" />
                <p className="text-sm! text-muted-foreground group-hover/out:text-red-500">
                  {locale === routing.defaultLocale ? "Keluar" : "Log out"}
                </p>
              </DialogTrigger>
              <DialogContent className="bg-white rounded-2xl max-w-sm">
                <DialogHeader>
                  <DialogTitle asChild>
                    <h5 className="text-red-600 font-semibold">
                      {locale === routing.defaultLocale
                        ? "Anda yakin ingin keluar?"
                        : "Are you sure you want to log out?"}
                    </h5>
                  </DialogTitle>
                  <DialogDescription className="mt-3">
                    {locale === routing.defaultLocale
                      ? "Anda akan keluar dari akun Anda dan perlu masuk kembali untuk mengakses data Anda."
                      : "You will be logged out of your account and will need to sign in again to access your data."}
                  </DialogDescription>
                  <DialogFooter>
                    <div className="flex items-center w-full mt-5 gap-5 justify-end">
                      <Button
                        variant="outline"
                        className="rounded-full"
                        onClick={handleCancel}
                        disabled={isLoading}
                      >
                        {locale === routing.defaultLocale ? "Batal" : "Cancel"}
                      </Button>
                      <Button
                        variant={"destructive_outline"}
                        className="btn btn-destructive gap-2 rounded-full px-5!"
                        onClick={handleSignOut}
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <Spinner />
                        ) : locale === routing.defaultLocale ? (
                          "Keluar"
                        ) : (
                          "Sign Out"
                        )}
                        {!isLoading && <IconLogout className="h-4 w-4" />}
                      </Button>
                    </div>
                  </DialogFooter>
                </DialogHeader>
              </DialogContent>
            </Dialog>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
