"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bot, Swords, Trophy, Wallet } from "lucide-react";

import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { Logo } from "@/components/logo";

const menuItems = [
  { href: "/tournaments", label: "Tournaments", icon: Swords },
  { href: "/leaderboard", label: "Leaderboard", icon: Trophy },
  { href: "/wallet", label: "Wallet", icon: Wallet },
  { href: "/recommendations", label: "AI Recommendations", icon: Bot },
];

export function MainSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar>
      <SidebarHeader>
        <Logo />
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton
                asChild
                isActive={pathname === item.href}
                tooltip={{ children: item.label, side: "right", align: "center" }}
              >
                <Link href={item.href}>
                  <item.icon />
                  <span>{item.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
}
