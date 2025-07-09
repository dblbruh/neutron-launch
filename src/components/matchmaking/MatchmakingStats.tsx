interface MatchmakingStatsProps {
  foundPlayers: number;
  averageRating: number;
  ping: string;
}

export default function MatchmakingStats({
  foundPlayers,
  averageRating,
  ping,
}: MatchmakingStatsProps) {
  return (
    <div className="grid grid-cols-3 gap-4 text-center">
      <div>
        <div className="text-2xl font-bold text-yellow-400">
          {foundPlayers}/10
        </div>
        <div className="text-sm text-zinc-400">Игроки найдены</div>
      </div>
      <div>
        <div className="text-2xl font-bold text-blue-400">~{averageRating}</div>
        <div className="text-sm text-zinc-400">Ср. рейтинг</div>
      </div>
      <div>
        <div className="text-2xl font-bold text-green-400">{ping}</div>
        <div className="text-sm text-zinc-400">Пинг</div>
      </div>
    </div>
  );
}
