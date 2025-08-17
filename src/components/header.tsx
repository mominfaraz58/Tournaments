
"use client";

import React from "react";
import { Bell, Gem, Power } from "lucide-react";
import { useWallet } from "@/context/wallet-provider";
import { Button } from "./ui/button";
import Image from "next/image";

export function Header() {
  const { diamonds } = useWallet();

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center justify-between bg-background px-4">
      <div className="flex items-center gap-2">
        <Image src="https://placehold.co/40x40.png" alt="SJ Battle Logo" data-ai-hint="flaming logo" width={40} height={40} className="rounded-md" />
        <h1 className="text-lg font-bold text-foreground">SJ BATTLE</h1>
      </div>
      <div className="flex items-center gap-2">
         <Button variant="outline" className="flex items-center gap-2 font-bold border-2 border-primary text-primary">
            <Gem className="size-5" />
            <span>{diamonds}</span>
        </Button>
      </div>
    </header>
  );
}
