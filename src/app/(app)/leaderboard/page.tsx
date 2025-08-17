import { Gem, Trophy } from "lucide-react";

import { LEADERBOARD } from "@/lib/constants";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Rank1, Rank2, Rank3 } from "@/components/rank-icons";

function Rank({ rank }: { rank: number }) {
  if (rank === 1) return <Rank1 />;
  if (rank === 2) return <Rank2 />;
  if (rank === 3) return <Rank3 />;
  return <span className="font-bold text-yellow-400">#{rank}</span>;
}

export default function LeaderboardPage() {
  return (
    <Card className="bg-transparent border-0 shadow-none">
      <CardHeader className="text-center p-4">
        <CardTitle className="font-headline text-3xl flex items-center justify-center gap-2 text-yellow-400">
          <Trophy className="size-8" /> Top 20 Players
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow className="border-b-2 border-muted-foreground">
              <TableHead className="w-[60px] text-center font-bold text-lg text-foreground">#</TableHead>
              <TableHead className="font-bold text-lg text-foreground">Name</TableHead>
              <TableHead className="text-right font-bold text-lg text-foreground">Winnings</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {LEADERBOARD.map((entry) => (
              <TableRow key={entry.rank} className="font-medium border-b border-muted">
                <TableCell className="text-center">
                  <Rank rank={entry.rank} />
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-4">
                    <span className="font-bold text-lg">{entry.playerName}</span>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2 text-lg font-bold text-cyan-400">
                        {entry.points.toLocaleString()}
                        <Gem className="size-4" />
                    </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
