import { Progress } from "@/components/ui/progress";
import Icon from "@/components/ui/icon";
import type { MatchmakingStep } from "@/types/matchmaking";

interface MatchmakingProgressProps {
  currentStep: MatchmakingStep;
  progress: number;
}

export default function MatchmakingProgress({
  currentStep,
  progress,
}: MatchmakingProgressProps) {
  return (
    <>
      {/* Текущий этап */}
      <div className="text-center">
        <div className="w-16 h-16 bg-gradient-to-br from-yellow-400/20 to-yellow-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <Icon
            name={currentStep.icon as any}
            size={32}
            className="text-yellow-400"
          />
        </div>
        <h3 className="text-xl font-semibold mb-2">{currentStep.title}</h3>
        <p className="text-zinc-400">{currentStep.description}</p>
      </div>

      {/* Прогресс */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>Прогресс</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>
    </>
  );
}
