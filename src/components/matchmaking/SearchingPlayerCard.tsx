import type { Player } from "@/types/matchmaking";

interface SearchingPlayerCardProps {
  player: Player;
  index: number;
}

export default function SearchingPlayerCard({
  player,
  index,
}: SearchingPlayerCardProps) {
  return (
    <div className="flex items-center justify-between p-2 bg-zinc-800/50 rounded-lg">
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 bg-gradient-to-br from-yellow-400/20 to-yellow-600/20 rounded-full flex items-center justify-center">
          <span className="text-xs font-bold text-yellow-400">{index + 1}</span>
        </div>
        <div>
          <div
            className={`font-medium ${
              player.isYou ? "text-blue-400" : "text-white"
            }`}
          >
            {player.name}
          </div>
          <div className="text-xs text-zinc-400">{player.rank}</div>
        </div>
      </div>
      <div className="text-sm font-medium">{player.rating}</div>
    </div>
  );
}
