"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { User, LogOut, Settings } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "./ui/button";

const pathToTitle: { [key: string]: string } = {
  "/tournaments": "Tournaments",
  "/leaderboard": "Leaderboard",
  "/wallet": "My Wallet",
  "/recommendations": "AI Tournament Recommendations",
};

export function Header() {
  const pathname = usePathname();
  const title = pathToTitle[pathname] || "Dashboard";

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b bg-background/80 px-6 backdrop-blur-md">
      <h1 className="text-2xl font-bold font-headline text-foreground">{title}</h1>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-10 w-10 rounded-full">
            <Avatar className="h-10 w-10">
              <AvatarImage src="https://placehold.co/100x100.png" alt="@shadcn" data-ai-hint="gamer avatar"/>
              <AvatarFallback>VF</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">ProGamerPK</p>
              <p className="text-xs leading-none text-muted-foreground">
                progamer.pk@example.com
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <User className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <LogOut className="mr-2 h-4 w-4" />
            <span>Log out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
