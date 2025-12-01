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

export function NavUser({ user }: { user: Account }) {
  const { isMobile } = useSidebar();

  const router = useRouter();
  const locale = useLocale();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground outline-0 border-0 ring-0 focus-visible:outline-0 focus-visible:border-0 focus-visible:ring-0 hover:outline-0 hover:border-0 hover:ring-0 p-4!"
            >
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
                <span className="truncate font-medium">{user.fullname}</span>
                <span className="text-muted-foreground truncate text-xs">
                  {user.email}
                </span>
              </div>
              <IconDotsVertical className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
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
                  <span className="truncate font-medium">{user.fullname}</span>
                  <span className="text-muted-foreground truncate text-xs">
                    {user.email}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <IconUserCircle />
                Pengaturan Akun
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => router.push(`/${locale}/sign-out`)}
            >
              <IconLogout />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
