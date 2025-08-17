"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Wallet, Users, User, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/tournaments", label: "Home", icon: Home },
  { href: "/wallet", label: "Wallet", icon: Wallet },
  { href: "/leaderboard", label: "Leaderboard", icon: Trophy },
  { href: "/recommendations", label: "AI", icon: User }, // Using User as a placeholder for the fourth icon
  { href: "/profile", label: "Profile", icon: Users }, // Using Users for the fifth icon
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 h-16 bg-background border-t border-border flex justify-around items-center z-20">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link href={item.href} key={item.href} className="flex flex-col items-center justify-center gap-1 text-muted-foreground w-full h-full">
            <item.icon className={cn("h-6 w-6", isActive && "text-primary")} />
            <span className={cn("text-xs", isActive && "text-primary")}>
              {item.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
