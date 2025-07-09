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

function MatchCard({
  match,
  roundIndex,
}: {
  match: Match;
  roundIndex: number;
}) {
  return (
    <div className="relative">
      <Card className="bg-zinc-800/50 border-zinc-700 hover:border-zinc-600 transition-colors w-48">
        <CardContent className="p-3">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-zinc-400 truncate">
                {match.team1 || "TBD"}
              </span>
              {match.score1 !== undefined && (
                <span className="text-sm font-mono text-white ml-2">
                  {match.score1}
                </span>
              )}
            </div>

            <div className="border-t border-zinc-600"></div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-zinc-400 truncate">
                {match.team2 || "TBD"}
              </span>
              {match.score2 !== undefined && (
                <span className="text-sm font-mono text-white ml-2">
                  {match.score2}
                </span>
              )}
            </div>

            {match.status === "ongoing" && (
              <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 text-xs w-full justify-center">
                Идет
              </Badge>
            )}
            {match.status === "completed" && match.winner && (
              <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-xs w-full justify-center">
                Завершен
              </Badge>
            )}
            {match.status === "pending" && (
              <Badge className="bg-zinc-500/20 text-zinc-400 border-zinc-500/30 text-xs w-full justify-center">
                Ожидание
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Линии соединения к следующему раунду */}
      {roundIndex < 5 && (
        <div className="absolute top-1/2 left-full w-8 h-px bg-zinc-600 transform -translate-y-1/2">
          <div className="absolute right-0 top-0 w-2 h-px bg-zinc-600"></div>
        </div>
      )}
    </div>
  );
}

function RoundConnectors({
  roundIndex,
  matchCount,
}: {
  roundIndex: number;
  matchCount: number;
}) {
  if (roundIndex >= 5) return null;

  const connectorHeight = 80 + Math.pow(2, roundIndex) * 20;

  return (
    <div
      className="flex flex-col justify-center space-y-4"
      style={{
        height: `${matchCount * (connectorHeight + 16)}px`,
        paddingTop: `${roundIndex * 40 + connectorHeight / 4}px`,
      }}
    >
      {Array.from({ length: Math.ceil(matchCount / 2) }, (_, i) => (
        <div key={i} className="relative">
          <div
            className="border-l-2 border-zinc-600 border-b-2 border-r-2"
            style={{
              height: `${connectorHeight}px`,
              width: "32px",
            }}
          >
            <div className="absolute bottom-0 right-0 w-2 h-px bg-zinc-600"></div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function TournamentBracket() {
  const bracket = createEmptyBracket();

  return (
    <div className="w-full overflow-x-auto bg-zinc-900/20 rounded-lg p-6">
      <div className="flex gap-16 min-w-max">
        {bracket.map((round, roundIndex) => (
          <div key={round.name} className="flex items-start gap-8">
            <div className="flex flex-col items-center">
              <h3 className="text-lg font-semibold text-center mb-6 text-yellow-400 bg-zinc-800/50 px-4 py-2 rounded-lg border border-zinc-700">
                {round.name}
              </h3>
              <div
                className="flex flex-col justify-center gap-4"
                style={{
                  paddingTop: `${roundIndex * 40}px`,
                  gap: `${Math.pow(2, roundIndex) * 16 + 16}px`,
                }}
              >
                {round.matches.map((match, matchIndex) => (
                  <MatchCard
                    key={match.id}
                    match={match}
                    roundIndex={roundIndex}
                  />
                ))}
              </div>
            </div>

            {/* Коннекторы между раундами */}
            {roundIndex < bracket.length - 1 && (
              <RoundConnectors
                roundIndex={roundIndex}
                matchCount={round.matches.length}
              />
            )}
          </div>
        ))}
      </div>

      {/* Легенда */}
      <div className="flex justify-center gap-6 mt-8 pt-6 border-t border-zinc-700">
        <div className="flex items-center gap-2">
          <Badge className="bg-zinc-500/20 text-zinc-400 border-zinc-500/30 text-xs">
            Ожидание
          </Badge>
          <span className="text-zinc-400 text-sm">Матч не начался</span>
        </div>
        <div className="flex items-center gap-2">
          <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 text-xs">
            Идет
          </Badge>
          <span className="text-zinc-400 text-sm">Матч в процессе</span>
        </div>
        <div className="flex items-center gap-2">
          <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-xs">
            Завершен
          </Badge>
          <span className="text-zinc-400 text-sm">Матч завершен</span>
        </div>
      </div>
    </div>
  );
}
