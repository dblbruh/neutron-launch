import TeamSection from "./TeamSection";
import type { Player } from "@/types/matchmaking";

interface TeamsDisplayProps {
  yourTeam: Player[];
  enemyTeam: Player[];
}

export default function TeamsDisplay({
  yourTeam,
  enemyTeam,
}: TeamsDisplayProps) {
  if (yourTeam.length === 0 || enemyTeam.length === 0) return null;

  return (
    <div className="space-y-4">
      <h4 className="text-lg font-semibold text-center">
        Команды сформированы
      </h4>

      <div className="grid md:grid-cols-2 gap-6">
        <TeamSection team={yourTeam} title="Ваша команда" teamType="your" />
        <TeamSection
          team={enemyTeam}
          title="Команда противника"
          teamType="enemy"
        />
      </div>
    </div>
  );
}
