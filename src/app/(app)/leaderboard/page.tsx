import { LEADERBOARD } from "@/lib/constants";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function LeaderboardPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Victory Fire Clash S1 Leaderboard</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px] text-center">Rank</TableHead>
              <TableHead>Player</TableHead>
              <TableHead className="text-center">Kills</TableHead>
              <TableHead className="text-right">Points</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {LEADERBOARD.map((entry) => (
              <TableRow key={entry.rank} className="font-medium">
                <TableCell className="text-center">
                  <Badge 
                    variant={entry.rank <= 3 ? "default" : "secondary"}
                    className={`text-lg h-8 w-8 flex items-center justify-center rounded-full ${
                      entry.rank === 1 ? 'bg-primary text-primary-foreground' : 
                      entry.rank === 2 ? 'bg-orange-400 text-black' :
                      entry.rank === 3 ? 'bg-yellow-600 text-white' : ''
                    }`}
                  >
                    {entry.rank}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-4">
                    <Avatar>
                      <AvatarImage src={`https://i.pravatar.cc/40?u=${entry.playerName}`} alt={entry.playerName} />
                      <AvatarFallback>{entry.playerName.substring(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <span className="font-bold">{entry.playerName}</span>
                  </div>
                </TableCell>
                <TableCell className="text-center text-lg text-muted-foreground">{entry.kills}</TableCell>
                <TableCell className="text-right text-lg font-bold text-primary">{entry.points.toLocaleString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
