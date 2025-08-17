
"use client";

import Link from "next/link";
import {
  UserCog,
  Wallet,
  Bell,
  Youtube,
  Headset,
  HelpCircle,
  Info,
  Shield,
  FileText,
  ChevronRight,
  Gem,
  Swords,
  Gamepad2,
} from "lucide-react";
import { useWallet } from "@/context/wallet-provider";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const StatCard = ({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
}) => (
  <Card className="flex-1 bg-card/80 shadow-lg">
    <CardContent className="p-3 text-center">
      <p className="text-2xl font-bold">{value}</p>
      <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground">
        <Icon className="size-4" />
        <span>{label}</span>
      </div>
    </CardContent>
  </Card>
);

const MenuItem = ({
  icon: Icon,
  label,
  href,
}: {
  icon: React.ElementType;
  label: string;
  href: string;
}) => (
  <Link href={href} className="w-full">
    <div className="flex items-center p-4 bg-card rounded-lg mb-2 hover:bg-card/80 transition-colors">
      <Icon className="size-6 text-primary mr-4" />
      <span className="flex-1 font-semibold text-lg">{label}</span>
      <ChevronRight className="size-6 text-muted-foreground" />
    </div>
  </Link>
);

export default function ProfilePage() {
  const { diamonds, matchesWon } = useWallet();
  const kills = 0; // Placeholder for kills
  const user = {
    name: "momin",
    phone: "+923114714991",
  };

  const menuItems = [
    { icon: UserCog, label: "Edit Profile", href: "#" },
    { icon: Wallet, label: "My Wallet", href: "/wallet" },
    { icon: Bell, label: "Notifications", href: "#" },
    { icon: Youtube, label: "Youtube Channel", href: "#" },
    { icon: Headset, label: "Customer Support", href: "#" },
    { icon: HelpCircle, label: "FAQ", href: "#" },
    { icon: Info, label: "About Us", href: "#" },
    { icon: Shield, label: "Privacy Policy", href: "#" },
    { icon: FileText, label: "Terms & Conditions", href: "#" },
  ];

  return (
    <div className="p-4 space-y-6">
      <div className="flex flex-col items-center text-center space-y-2">
        <Avatar className="w-24 h-24 text-4xl bg-primary">
          <AvatarFallback>{user.name.charAt(0).toUpperCase()}</AvatarFallback>
        </Avatar>
        <h1 className="text-2xl font-bold">{user.name}</h1>
        <p className="text-muted-foreground">{user.phone}</p>
      </div>

      <div className="flex justify-around gap-4">
        <StatCard icon={Gem} label="Winnings" value={diamonds} />
        <StatCard icon={Swords} label="Kills" value={kills} />
        <StatCard icon={Gamepad2} label="Matches" value={matchesWon} />
      </div>

      <div className="space-y-2">
        {menuItems.map((item) => (
          <MenuItem key={item.label} {...item} />
        ))}
      </div>
    </div>
  );
}
