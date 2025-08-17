
"use client";

import Link from "next/link";
import { redirect, usePathname } from "next/navigation";
import { Gift, Home, User, Users, Wallet } from "lucide-react";

import { BottomNav } from "@/components/bottom-nav";
import { Header } from "@/components/header";
import { useAuth } from "@/context/auth-provider";
import { useEffect } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Logo } from "@/components/logo";

const navItems = [
  { href: "/tournaments", label: "Home", icon: Home },
  { href: "/wallet",label: "Wallet", icon: Wallet },
  { href: "/leaderboard", label: "Leaderboard", icon: Users },
  { href: "/refer", label: "Refer & Earn", icon: Gift },
  { href: "/profile", label: "Profile", icon: User },
];

function AppLayoutContent({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !user) {
      redirect('/auth/login');
    }
  }, [user, loading, pathname]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  if (!user) {
    return null; // Or a redirect component
  }

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarContent className="p-2">
            <div className="p-2 pb-4">
               <Logo />
            </div>
          <SidebarMenu>
            {navItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <Link href={item.href} legacyBehavior passHref>
                  <SidebarMenuButton
                    isActive={pathname === item.href}
                    tooltip={{
                      children: item.label,
                    }}
                  >
                    <item.icon />
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-1 pb-20 md:pb-0">
            <div className="p-4">
              {children}
            </div>
          </main>
          <div className="md:hidden">
            <BottomNav />
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AppLayoutContent>{children}</AppLayoutContent>
  );
}
