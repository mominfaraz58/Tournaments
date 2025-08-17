"use client";

import React from "react";
import { Bell, LogOut, Power } from "lucide-react";

import { Button } from "./ui/button";
import Image from "next/image";

export function Header() {
  return (
    <header className="sticky top-0 z-10 flex h-16 items-center justify-between bg-background px-4">
      <div className="flex items-center gap-2">
        <Image src="https://placehold.co/40x40.png" alt="SJ Battle Logo" data-ai-hint="flaming logo" width={40} height={40} className="rounded-md" />
        <h1 className="text-lg font-bold text-foreground">SJ BATTLE</h1>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="flex flex-col h-auto">
          <Bell className="h-6 w-6 text-primary"/>
          <span className="text-xs">Alerts</span>
        </Button>
        <Button variant="ghost" size="icon" className="flex flex-col h-auto">
          <Power className="h-6 w-6 text-red-500"/>
          <span className="text-xs">Logout</span>
        </Button>
      </div>
    </header>
  );
}
