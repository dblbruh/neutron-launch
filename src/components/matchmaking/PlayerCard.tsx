import { Badge } from "@/components/ui/badge";
import Icon from "@/components/ui/icon";
import type { Player } from "@/types/matchmaking";

interface PlayerCardProps {
  player: Player;
  teamType: "your" | "enemy";
  index?: number;
}

export default function PlayerCard({
  player,
  teamType,
  index,
}: PlayerCardProps) {
  const isYourTeam = teamType === "your";

  return (
    <div
      className={`p-3 rounded-lg border ${
        player.isYou
          ? "bg-blue-500/10 border-blue-500/30"
          : isYourTeam
            ? "bg-zinc-800/50 border-zinc-700/50"
            : "bg-zinc-800/50 border-zinc-700/50"
      }`}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          <div
            className={`w-6 h-6 bg-gradient-to-br rounded-full flex items-center justify-center ${
              isYourTeam
                ? "from-blue-400/20 to-blue-600/20"
                : "from-red-400/20 to-red-600/20"
            }`}
          >
            {player.isYou ? (
              <Icon name="User" size={12} className="text-blue-400" />
            ) : (
              <Icon
                name="Users"
                size={12}
                className={isYourTeam ? "text-blue-400" : "text-red-400"}
              />
            )}
          </div>
          <span
            className={`font-medium ${
              player.isYou ? "text-blue-400" : "text-white"
            }`}
          >
            {player.name}
          </span>
          {player.isYou && (
            <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 text-xs px-1 py-0">
              ВЫ
            </Badge>
          )}
        </div>
        <span className="text-sm font-medium">{player.rating}</span>
      </div>

      <div className="grid grid-cols-3 gap-2 text-xs">
        <div className="text-center">
          <div className="text-white font-medium">{player.winRate}%</div>
          <div className="text-zinc-400">Винрейт</div>
        </div>
        <div className="text-center">
          <div className="text-white font-medium">{player.kd}</div>
          <div className="text-zinc-400">K/D</div>
        </div>
        <div className="text-center">
          <div className="text-white font-medium">{player.wins}</div>
          <div className="text-zinc-400">Побед</div>
        </div>
      </div>
    </div>
  );
}
