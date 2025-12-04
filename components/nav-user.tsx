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

import Avatar from "boring-avatars";
import Image from "next/image";
import { Account } from "@/types/account.types";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";

export function NavUser({
  user,
  type,
}: {
  user: Account;
  type?: "header" | "side";
}) {
  const { isMobile } = useSidebar();

  const router = useRouter();
  const locale = useLocale();

  return (
    <SidebarMenu>
      <SidebarMenuItem className="px-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible::bg-sidebar-accent focus-visible::text-sidebar-accent-foreground rounded-2xl! focus:outline focus-visible:outline hover:outline px-2 py-2 flex gap-3 items-center w-full">
              {user.google_avatar || user.avatar_url ? (
                <Image
                  src={user.google_avatar || user.avatar_url}
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
            </button>
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
                    src={user.google_avatar || user.avatar_url}
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
              <DropdownMenuItem>
                <IconUserCircle />
                <p className="text-sm! text-muted-foreground">
                  Pengaturan Akun
                </p>
              </DropdownMenuItem>
            </DropdownMenuGroup>

            <DropdownMenuItem
              onClick={() => router.push(`/${locale}/sign-out`)}
            >
              <IconLogout />
              <p className="text-sm! text-muted-foreground">Log out</p>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
