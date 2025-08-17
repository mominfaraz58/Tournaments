import { TournamentCard } from "@/components/tournament-card";
import { TOURNAMENTS } from "@/lib/constants";

export default function TournamentsPage() {
  return (
    <div className="container mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {TOURNAMENTS.map((tournament) => (
          <TournamentCard key={tournament.id} tournament={tournament} />
        ))}
      </div>
    </div>
  );
}
