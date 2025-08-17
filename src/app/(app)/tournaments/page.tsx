import Image from "next/image";
import Link from "next/link";
import { TOURNAMENTS } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Crown, Gem, Target, Trophy } from "lucide-react";

function CategoryCard({ category }: { category: { name: string; imageUrl: string, imageHint: string } }) {
  return (
    <div className="relative aspect-square rounded-lg overflow-hidden group">
      <Image 
        src={category.imageUrl} 
        alt={category.name} 
        data-ai-hint={category.imageHint}
        fill 
        className="object-cover transition-transform duration-300 group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-3">
        <h3 className="text-white text-center font-bold text-sm uppercase tracking-wider">{category.name}</h3>
      </div>
    </div>
  );
}

export default function TournamentsPage() {
  return (
    <div className="p-4 space-y-4">
      <div className="bg-card text-card-foreground rounded-lg p-4 space-y-4">
        <h2 className="text-center text-lg font-bold tracking-wider text-primary">
          <span role="img" aria-label="fire">🔥</span> WELCOME TO SJ BATTLE <span role="img" aria-label="fire">🔥</span>
        </h2>
        <ul className="space-y-3 font-medium">
          <li className="flex items-center gap-3">
            <Trophy className="size-5 text-yellow-500" />
            <span>DAILY MATCHES</span>
          </li>
          <li className="flex items-center gap-3">
            <Gem className="size-5 text-blue-500" />
            <span>DIAMONDS & CASH PRIZES</span>
          </li>
          <li className="flex items-center gap-3">
            <Crown className="size-5 text-yellow-400" />
            <span>FAIR GAMEPLAY, ZERO HACKS</span>
          </li>
          <li className="flex items-center gap-3">
            <Target className="size-5 text-red-500" />
            <span>SOLO / DUO / SQUAD MATCHES</span>
          </li>
        </ul>
        <Link href="https://wa.me/923114714991" target="_blank" rel="noopener noreferrer" className="block">
          <div className="bg-primary text-primary-foreground text-center p-2 rounded-md font-bold">
            CONTACT ADMINE - 03114714991
          </div>
        </Link>
      </div>
      
      <div className="relative rounded-lg overflow-hidden">
        <Image 
          src="https://placehold.co/600x300.png"
          data-ai-hint="esports tournament update"
          alt="New Update" 
          width={600} 
          height={300} 
          className="w-full object-cover" 
        />
        <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
            <h2 className="text-white text-4xl font-extrabold text-center drop-shadow-lg">
                <span className="text-green-400">FIRST TOURNAMENT</span>
                <br />
                <span className="text-xl">APP IN PAKISTAN</span>
            </h2>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {TOURNAMENTS.map((tournament) => (
          <CategoryCard 
            key={tournament.id}
            category={{
              name: tournament.name,
              imageUrl: tournament.imageUrl,
              imageHint: tournament.imageHint,
            }} 
          />
        ))}
        {/* Add more categories to fill the grid based on the design */}
        <CategoryCard category={{ name: 'BATTLE ROYALE (Duo/Team)', imageUrl: 'https://placehold.co/400x400.png', imageHint: 'team battle' }} />
        <CategoryCard category={{ name: 'LW LOW ENTRY', imageUrl: 'https://placehold.co/400x400.png', imageHint: 'low entry fee' }} />
        <CategoryCard category={{ name: 'CS 1 Vs 1', imageUrl: 'https://placehold.co/400x400.png', imageHint: 'one on one' }} />
        <CategoryCard category={{ name: 'CS 2 Vs 2', imageUrl: 'https://placehold.co/400x400.png', imageHint: 'two on two' }} />
        <CategoryCard category={{ name: 'CS 4 Vs 4', imageUrl: 'https://placehold.co/400x400.png', imageHint: 'squad battle' }} />
      </div>
    </div>
  );
}
