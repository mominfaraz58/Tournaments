"use client";

import Image from "next/image";
import { Calendar, Gem, Landmark, Users } from "lucide-react";
import type { Tournament } from "@/lib/types";
import { useWallet } from "@/context/wallet-provider";
import { Button } from "./ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";

interface TournamentCardProps {
  tournament: Tournament;
}

export function TournamentCard({ tournament }: TournamentCardProps) {
  const { registerForTournament } = useWallet();

  const handleRegister = () => {
    registerForTournament(tournament.entryFee);
  };

  return (
    <Card className="flex flex-col overflow-hidden transition-all hover:shadow-lg hover:shadow-primary/20">
      <CardHeader className="p-0">
        <div className="relative h-48 w-full">
          <Image
            src={tournament.imageUrl}
            alt={tournament.name}
            data-ai-hint={tournament.imageHint}
            fill
            className="object-cover"
          />
        </div>
        <div className="p-6 pb-2">
          <CardTitle className="font-headline text-2xl mb-2">{tournament.name}</CardTitle>
          <div className="flex items-center text-sm text-muted-foreground gap-4">
            <span className="flex items-center gap-1.5"><Calendar className="size-4" /> {tournament.date}</span>
            <span className="flex items-center gap-1.5"><Users className="size-4" /> {tournament.format}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-grow p-6 pt-0">
        <div className="flex justify-between items-center text-foreground">
          <div className="flex flex-col items-center">
            <span className="text-sm text-muted-foreground">Prize Pool</span>
            <div className="flex items-center gap-2 font-bold text-lg text-primary">
              <Gem className="size-5" />
              <span>{tournament.prizePool.toLocaleString()}</span>
            </div>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-sm text-muted-foreground">Entry Fee</span>
            <div className="flex items-center gap-2 font-bold text-lg">
              <Landmark className="size-5" />
              <span>Rs. {tournament.entryFee.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 bg-card/50">
        <Button className="w-full font-bold text-lg" size="lg" onClick={handleRegister}>
          Register Now
        </Button>
      </CardFooter>
    </Card>
  );
}
