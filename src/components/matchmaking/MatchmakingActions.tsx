import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";

interface MatchmakingActionsProps {
  isSearching: boolean;
  onCancel: () => void;
  onAccept: () => void;
}

export default function MatchmakingActions({
  isSearching,
  onCancel,
  onAccept,
}: MatchmakingActionsProps) {
  return (
    <div className="flex gap-4">
      {isSearching ? (
        <Button
          onClick={onCancel}
          variant="outline"
          className="flex-1 border-zinc-700 text-zinc-300 hover:text-white"
        >
          Отменить поиск
        </Button>
      ) : (
        <>
          <Button
            onClick={onCancel}
            variant="outline"
            className="flex-1 border-zinc-700 text-zinc-300 hover:text-white"
          >
            Отклонить
          </Button>
          <Button
            onClick={onAccept}
            className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700"
          >
            <Icon name="Play" size={16} className="mr-2" />
            Принять
          </Button>
        </>
      )}
    </div>
  );
}
