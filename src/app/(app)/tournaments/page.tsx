import Image from "next/image";
import { TOURNAMENTS } from "@/lib/constants";
import { Button } from "@/components/ui/button";

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
      <h2 className="text-center text-lg font-bold tracking-widest text-primary-foreground/80">MATCHES</h2>
      <div className="bg-white text-black text-center p-2 rounded-md font-bold">
        CONTACT ADMINE - 03184775411
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
                <span className="text-green-400">NEW UPDATE</span>
                <br />
                <span className="text-xl">TOURNAMENT APP</span>
            </h2>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {TOURNAMENTS.map((tournament) => (
          <CategoryCard 
            key={tournament.id}
            category={{
              name: tournament.name.replace("Victory Fire Clash S1", "Battle Royale (Squad/Team)").replace("Lone Wolf Championship", "Battle Royale (Solo)").replace("Karachi Squad Wars", "Lone Wolf (1v1)").replace("Lahore Legends Cup", "Lone Wolf (2v2)"), // Simple mapping for demo
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
