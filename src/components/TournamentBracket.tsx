import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Match {
  id: string;
  team1?: string;
  team2?: string;
  score1?: number;
  score2?: number;
  winner?: string;
  status: "pending" | "completed" | "ongoing";
}

interface BracketRound {
  name: string;
  matches: Match[];
}

const createEmptyBracket = (): BracketRound[] => {
  return [
    {
      name: "1/32",
      matches: Array.from({ length: 16 }, (_, i) => ({
        id: `r1-${i}`,
        status: "pending" as const,
      })),
    },
    {
      name: "1/16",
      matches: Array.from({ length: 8 }, (_, i) => ({
        id: `r2-${i}`,
        status: "pending" as const,
      })),
    },
    {
      name: "1/8",
      matches: Array.from({ length: 4 }, (_, i) => ({
        id: `r3-${i}`,
        status: "pending" as const,
      })),
    },
    {
      name: "1/4",
      matches: Array.from({ length: 2 }, (_, i) => ({
        id: `r4-${i}`,
        status: "pending" as const,
      })),
    },
    {
      name: "1/2",
      matches: Array.from({ length: 1 }, (_, i) => ({
        id: `r5-${i}`,
        status: "pending" as const,
      })),
    },
    {
      name: "Финал",
      matches: Array.from({ length: 1 }, (_, i) => ({
        id: `final-${i}`,
        status: "pending" as const,
      })),
    },
  ];
};

function MatchCard({ match }: { match: Match }) {
  return (
    <Card className="bg-zinc-800/50 border-zinc-700 hover:border-zinc-600 transition-colors">
      <CardContent className="p-3">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-zinc-400">
              {match.team1 || "TBD"}
            </span>
            {match.score1 !== undefined && (
              <span className="text-sm font-mono text-white">
                {match.score1}
              </span>
            )}
          </div>

          <div className="border-t border-zinc-600"></div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-zinc-400">
              {match.team2 || "TBD"}
            </span>
            {match.score2 !== undefined && (
              <span className="text-sm font-mono text-white">
                {match.score2}
              </span>
            )}
          </div>

          {match.status === "ongoing" && (
            <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 text-xs">
              Идет
            </Badge>
          )}
          {match.status === "completed" && match.winner && (
            <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-xs">
              Завершен
            </Badge>
          )}
          {match.status === "pending" && (
            <Badge className="bg-zinc-500/20 text-zinc-400 border-zinc-500/30 text-xs">
              Ожидание
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default function TournamentBracket() {
  const bracket = createEmptyBracket();

  return (
    <div className="w-full overflow-x-auto">
      <div className="flex gap-8 min-w-max p-4">
        {bracket.map((round, roundIndex) => (
          <div key={round.name} className="flex flex-col">
            <h3 className="text-lg font-semibold text-center mb-4 text-yellow-400">
              {round.name}
            </h3>
            <div
              className="flex flex-col gap-4"
              style={{
                paddingTop: `${roundIndex * 40}px`,
                gap: `${Math.pow(2, roundIndex) * 8 + 16}px`,
              }}
            >
              {round.matches.map((match) => (
                <MatchCard key={match.id} match={match} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
