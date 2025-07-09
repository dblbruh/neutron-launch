import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useMatchmaking } from "@/hooks/useMatchmaking";
import MatchmakingProgress from "./matchmaking/MatchmakingProgress";
import MatchmakingStats from "./matchmaking/MatchmakingStats";
import TeamsDisplay from "./matchmaking/TeamsDisplay";
import SearchingPlayers from "./matchmaking/SearchingPlayers";
import ServerInfo from "./matchmaking/ServerInfo";
import MatchmakingActions from "./matchmaking/MatchmakingActions";
import type { MatchmakingModalProps } from "@/types/matchmaking";

export default function MatchmakingModal({
  isOpen,
  onClose,
  gameMode,
}: MatchmakingModalProps) {
  const {
    currentStep,
    currentStepData,
    progress,
    players,
    foundPlayers,
    yourTeam,
    enemyTeam,
    selectedServer,
    isSearching,
  } = useMatchmaking(isOpen);

  const handleCancel = () => {
    onClose();
  };

  const handleAccept = () => {
    alert("🎮 Подключение к серверу... (это демо)");
    onClose();
  };

  if (!isOpen) return null;

  const showTeams =
    currentStep >= 1 && yourTeam.length > 0 && enemyTeam.length > 0;
  const showSearchingPlayers = foundPlayers > 0 && currentStep === 0;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-zinc-900 border-zinc-800 text-white max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">
            Поиск игры: {gameMode}
          </DialogTitle>
          <DialogDescription className="text-zinc-400 text-center">
            {isSearching
              ? "Подбираем достойных соперников..."
              : "Матч готов к запуску!"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <MatchmakingProgress
            currentStep={currentStepData}
            progress={progress}
          />

          <MatchmakingStats
            foundPlayers={foundPlayers}
            averageRating={2847}
            ping={selectedServer ? "15ms" : "--"}
          />

          {showTeams && (
            <TeamsDisplay yourTeam={yourTeam} enemyTeam={enemyTeam} />
          )}

          {showSearchingPlayers && (
            <SearchingPlayers players={players} foundPlayers={foundPlayers} />
          )}

          <ServerInfo selectedServer={selectedServer} />

          <MatchmakingActions
            isSearching={isSearching}
            onCancel={handleCancel}
            onAccept={handleAccept}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
