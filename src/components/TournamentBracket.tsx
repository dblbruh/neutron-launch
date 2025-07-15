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
  const getTeamClass = (teamScore?: number, opponentScore?: number) => {
    if (
      match.status === "completed" &&
      teamScore !== undefined &&
      opponentScore !== undefined
    ) {
      return teamScore > opponentScore
        ? "text-green-400 font-semibold"
        : "text-zinc-400";
    }
    return "text-zinc-200";
  };

  return (
    <div className="relative">
      <Card className="bg-zinc-800/80 border border-zinc-700/60 hover:border-zinc-600/80 hover:bg-zinc-800/90 transition-all duration-200 w-32 md:w-40 shadow-lg hover:shadow-xl">
        <CardContent className="p-3">
          <div className="space-y-2">
            {/* Команда 1 */}
            <div className="flex items-center justify-between">
              <span
                className={`text-xs font-medium truncate max-w-[80px] md:max-w-[100px] ${getTeamClass(
                  match.score1,
                  match.score2,
                )}`}
              >
                {match.team1 || "TBD"}
              </span>
              {match.score1 !== undefined && (
                <span
                  className={`text-sm font-bold font-mono min-w-[20px] text-center ${getTeamClass(
                    match.score1,
                    match.score2,
                  )}`}
                >
                  {match.score1}
                </span>
              )}
            </div>

            {/* Разделительная линия */}
            <div className="border-t border-zinc-600/60"></div>

            {/* Команда 2 */}
            <div className="flex items-center justify-between">
              <span
                className={`text-xs font-medium truncate max-w-[80px] md:max-w-[100px] ${getTeamClass(
                  match.score2,
                  match.score1,
                )}`}
              >
                {match.team2 || "TBD"}
              </span>
              {match.score2 !== undefined && (
                <span
                  className={`text-sm font-bold font-mono min-w-[20px] text-center ${getTeamClass(
                    match.score2,
                    match.score1,
                  )}`}
                >
                  {match.score2}
                </span>
              )}
            </div>

            {/* Статус матча */}
            <div className="pt-0.5">
              {match.status === "ongoing" && (
                <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/40 text-xs w-full justify-center py-0.5 font-medium">
                  🔴 Идет
                </Badge>
              )}
              {match.status === "completed" && match.winner && (
                <Badge className="bg-green-500/20 text-green-400 border-green-500/40 text-xs w-full justify-center py-0.5 font-medium">
                  ✅ Завершен
                </Badge>
              )}
              {match.status === "pending" && (
                <Badge className="bg-zinc-500/20 text-zinc-400 border-zinc-500/40 text-xs w-full justify-center py-0.5 font-medium">
                  ⏳ Ожидание
                </Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Улучшенные линии соединения */}
      {roundIndex < 5 && (
        <div className="absolute top-1/2 left-full transform -translate-y-1/2">
          <div className="w-8 h-0.5 bg-gradient-to-r from-zinc-500 to-zinc-600">
            <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-zinc-500 rounded-full"></div>
          </div>
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
  const connectorSpacing = Math.pow(2, roundIndex + 1) * 15;

  return (
    <div
      className="flex flex-col justify-center"
      style={{
        height: `${matchCount * (connectorHeight + connectorSpacing)}px`,
        paddingTop: `${roundIndex * 40 + connectorHeight / 3}px`,
        gap: `${connectorSpacing}px`,
      }}
    >
      {Array.from({ length: Math.ceil(matchCount / 2) }, (_, i) => (
        <div key={i} className="relative">
          <svg width="32" height={connectorHeight} className="overflow-visible">
            {/* Вертикальная левая линия */}
            <line
              x1="0"
              y1="0"
              x2="0"
              y2={connectorHeight}
              stroke="#52525b"
              strokeWidth="2"
              className="drop-shadow-sm"
            />
            {/* Горизонтальная верхняя линия */}
            <line
              x1="0"
              y1={connectorHeight / 4}
              x2="32"
              y2={connectorHeight / 4}
              stroke="#52525b"
              strokeWidth="2"
              className="drop-shadow-sm"
            />
            {/* Горизонтальная нижняя линия */}
            <line
              x1="0"
              y1={(connectorHeight * 3) / 4}
              x2="32"
              y2={(connectorHeight * 3) / 4}
              stroke="#52525b"
              strokeWidth="2"
              className="drop-shadow-sm"
            />
            {/* Вертикальная соединительная линия */}
            <line
              x1="32"
              y1={connectorHeight / 4}
              x2="32"
              y2={(connectorHeight * 3) / 4}
              stroke="#52525b"
              strokeWidth="2"
              className="drop-shadow-sm"
            />
            {/* Финальная горизонтальная линия к следующему матчу */}
            <line
              x1="32"
              y1={connectorHeight / 2}
              x2="40"
              y2={connectorHeight / 2}
              stroke="#52525b"
              strokeWidth="2"
              className="drop-shadow-sm"
            />
            {/* Точка соединения */}
            <circle
              cx="32"
              cy={connectorHeight / 2}
              r="3"
              fill="#52525b"
              className="drop-shadow-sm"
            />
          </svg>
        </div>
      ))}
    </div>
  );
}

export default function TournamentBracket() {
  const bracket = createEmptyBracket();

  return (
    <div className="w-full overflow-x-auto bg-gradient-to-br from-zinc-900/30 to-zinc-800/20 rounded-xl p-4 md:p-8 border border-zinc-700/30">
      <div className="flex gap-8 md:gap-12 min-w-max">
        {bracket.map((round, roundIndex) => (
          <div key={round.name} className="flex items-start gap-4 md:gap-8">
            <div className="flex flex-col items-center">
              {/* Заголовок раунда */}
              <div className="relative mb-6">
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 to-yellow-500/20 blur-lg rounded-lg"></div>
                <h3 className="relative text-sm font-bold text-center text-yellow-400 bg-zinc-800/80 px-4 py-2 rounded-lg border border-yellow-500/30 backdrop-blur-sm shadow-lg">
                  {round.name}
                </h3>
              </div>

              {/* Матчи раунда */}
              <div
                className="flex flex-col justify-center"
                style={{
                  paddingTop: `${roundIndex * 40}px`,
                  gap: `${Math.pow(2, roundIndex) * 15 + 15}px`,
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

      {/* Улучшенная легенда */}
      <div className="flex flex-wrap justify-center gap-8 mt-12 pt-8 border-t border-zinc-700/50">
        <div className="flex items-center gap-3 bg-zinc-800/40 px-4 py-2 rounded-lg border border-zinc-700/40">
          <Badge className="bg-zinc-500/20 text-zinc-400 border-zinc-500/40 text-xs px-2 py-1">
            ⏳ Ожидание
          </Badge>
          <span className="text-zinc-300 text-sm font-medium">
            Матч не начался
          </span>
        </div>
        <div className="flex items-center gap-3 bg-zinc-800/40 px-4 py-2 rounded-lg border border-zinc-700/40">
          <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/40 text-xs px-2 py-1">
            🔴 Идет
          </Badge>
          <span className="text-zinc-300 text-sm font-medium">
            Матч в процессе
          </span>
        </div>
        <div className="flex items-center gap-3 bg-zinc-800/40 px-4 py-2 rounded-lg border border-zinc-700/40">
          <Badge className="bg-green-500/20 text-green-400 border-green-500/40 text-xs px-2 py-1">
            ✅ Завершен
          </Badge>
          <span className="text-zinc-300 text-sm font-medium">
            Матч завершен
          </span>
        </div>
      </div>
    </div>
  );
}