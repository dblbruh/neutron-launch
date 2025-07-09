import PlayerCard from "./PlayerCard";
import type { Player } from "@/types/matchmaking";

interface TeamSectionProps {
  team: Player[];
  title: string;
  teamType: "your" | "enemy";
}

export default function TeamSection({
  team,
  title,
  teamType,
}: TeamSectionProps) {
  const titleColor = teamType === "your" ? "text-blue-400" : "text-red-400";

  return (
    <div className="space-y-3">
      <h5 className={`text-md font-semibold ${titleColor} text-center`}>
        {title}
      </h5>
      <div className="space-y-2">
        {team.map((player) => (
          <PlayerCard key={player.id} player={player} teamType={teamType} />
        ))}
      </div>
    </div>
  );
}
