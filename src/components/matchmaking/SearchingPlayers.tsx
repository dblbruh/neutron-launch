import SearchingPlayerCard from "./SearchingPlayerCard";
import type { Player } from "@/types/matchmaking";

interface SearchingPlayersProps {
  players: Player[];
  foundPlayers: number;
}

export default function SearchingPlayers({
  players,
  foundPlayers,
}: SearchingPlayersProps) {
  if (foundPlayers === 0) return null;

  return (
    <div className="space-y-3">
      <h4 className="text-lg font-semibold">Найденные игроки:</h4>
      <div className="max-h-40 overflow-y-auto space-y-2">
        {players.slice(0, foundPlayers).map((player, index) => (
          <SearchingPlayerCard key={player.id} player={player} index={index} />
        ))}
      </div>
    </div>
  );
}
