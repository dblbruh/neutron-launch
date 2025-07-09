import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import Icon from "@/components/ui/icon";

interface MatchmakingModalProps {
  isOpen: boolean;
  onClose: () => void;
  gameMode: string;
}

interface Player {
  id: string;
  name: string;
  rating: number;
  rank: string;
  avatar: string;
}

interface MatchmakingStep {
  id: string;
  title: string;
  description: string;
  duration: number;
  icon: string;
}

const matchmakingSteps: MatchmakingStep[] = [
  {
    id: "searching",
    title: "Поиск игроков",
    description: "Ищем игроков с похожим рейтингом...",
    duration: 3000,
    icon: "Search",
  },
  {
    id: "balancing",
    title: "Балансировка команд",
    description: "Создаем сбалансированные команды...",
    duration: 2000,
    icon: "Scale",
  },
  {
    id: "server",
    title: "Подбор сервера",
    description: "Выбираем сервер с минимальным пингом...",
    duration: 2000,
    icon: "Server",
  },
  {
    id: "ready",
    title: "Матч найден!",
    description: "Подготовка к игре...",
    duration: 1000,
    icon: "CheckCircle",
  },
];

const generateRandomPlayers = (): Player[] => {
  const names = [
    "s1mple",
    "ZywOo",
    "sh1ro",
    "electronic",
    "NiKo",
    "device",
    "Ax1Le",
    "nafany",
    "Perfecto",
    "b1t",
  ];
  const ranks = ["Серебро", "Золото", "Рубин", "Элита"];

  return Array.from({ length: 9 }, (_, i) => ({
    id: `player-${i}`,
    name:
      names[Math.floor(Math.random() * names.length)] +
      Math.floor(Math.random() * 1000),
    rating: 2500 + Math.floor(Math.random() * 1000),
    rank: ranks[Math.floor(Math.random() * ranks.length)],
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${i}`,
  }));
};

export default function MatchmakingModal({
  isOpen,
  onClose,
  gameMode,
}: MatchmakingModalProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [players, setPlayers] = useState<Player[]>([]);
  const [foundPlayers, setFoundPlayers] = useState(0);
  const [selectedServer, setSelectedServer] = useState("");
  const [isSearching, setIsSearching] = useState(true);

  const servers = [
    { name: "Москва", ping: 15, location: "🇷🇺" },
    { name: "Санкт-Петербург", ping: 25, location: "🇷🇺" },
    { name: "Екатеринбург", ping: 45, location: "🇷🇺" },
  ];

  useEffect(() => {
    if (!isOpen) {
      setCurrentStep(0);
      setProgress(0);
      setPlayers([]);
      setFoundPlayers(0);
      setSelectedServer("");
      setIsSearching(true);
      return;
    }

    setPlayers(generateRandomPlayers());

    const timer = setTimeout(() => {
      const step = matchmakingSteps[currentStep];

      if (step.id === "searching") {
        // Симуляция поиска игроков
        const playerTimer = setInterval(() => {
          setFoundPlayers((prev) => {
            if (prev >= 9) {
              clearInterval(playerTimer);
              setTimeout(() => setCurrentStep(1), 500);
              return 9;
            }
            return prev + 1;
          });
        }, 300);
      } else if (step.id === "server") {
        // Симуляция подбора сервера
        setTimeout(() => {
          setSelectedServer(servers[0].name);
        }, 1000);
      } else if (step.id === "ready") {
        // Завершение поиска
        setTimeout(() => {
          setIsSearching(false);
        }, 1000);
      }

      if (currentStep < matchmakingSteps.length - 1) {
        setTimeout(() => {
          setCurrentStep((prev) => prev + 1);
        }, step.duration);
      }

      // Обновление прогресса
      const progressTimer = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(progressTimer);
            return 100;
          }
          return prev + 100 / (step.duration / 100);
        });
      }, 100);
    }, 500);

    return () => clearTimeout(timer);
  }, [currentStep, isOpen]);

  const handleCancel = () => {
    setIsSearching(false);
    onClose();
  };

  const handleAccept = () => {
    // Здесь будет логика подключения к серверу
    alert("🎮 Подключение к серверу... (это демо)");
    onClose();
  };

  if (!isOpen) return null;

  const currentStepData = matchmakingSteps[currentStep];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-zinc-900 border-zinc-800 text-white max-w-2xl">
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
          {/* Текущий этап */}
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-yellow-400/20 to-yellow-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Icon
                name={currentStepData.icon as any}
                size={32}
                className="text-yellow-400"
              />
            </div>
            <h3 className="text-xl font-semibold mb-2">
              {currentStepData.title}
            </h3>
            <p className="text-zinc-400">{currentStepData.description}</p>
          </div>

          {/* Прогресс */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Прогресс</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Статистика поиска */}
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-yellow-400">
                {foundPlayers}/9
              </div>
              <div className="text-sm text-zinc-400">Игроки найдены</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-400">~2847</div>
              <div className="text-sm text-zinc-400">Ср. рейтинг</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-400">
                {selectedServer ? "15ms" : "--"}
              </div>
              <div className="text-sm text-zinc-400">Пинг</div>
            </div>
          </div>

          {/* Список игроков */}
          {foundPlayers > 0 && (
            <div className="space-y-3">
              <h4 className="text-lg font-semibold">Найденные игроки:</h4>
              <div className="max-h-40 overflow-y-auto space-y-2">
                {players.slice(0, foundPlayers).map((player, index) => (
                  <div
                    key={player.id}
                    className="flex items-center justify-between p-2 bg-zinc-800/50 rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-yellow-400/20 to-yellow-600/20 rounded-full flex items-center justify-center">
                        <span className="text-xs font-bold text-yellow-400">
                          {index + 1}
                        </span>
                      </div>
                      <div>
                        <div className="font-medium">{player.name}</div>
                        <div className="text-xs text-zinc-400">
                          {player.rank}
                        </div>
                      </div>
                    </div>
                    <div className="text-sm font-medium">{player.rating}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Сервер */}
          {selectedServer && (
            <div className="p-4 bg-zinc-800/50 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold">Выбранный сервер</h4>
                  <p className="text-sm text-zinc-400">{selectedServer}</p>
                </div>
                <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                  {servers[0].ping}ms
                </Badge>
              </div>
            </div>
          )}

          {/* Кнопки */}
          <div className="flex gap-4">
            {isSearching ? (
              <Button
                onClick={handleCancel}
                variant="outline"
                className="flex-1 border-zinc-700 text-zinc-300 hover:text-white"
              >
                Отменить поиск
              </Button>
            ) : (
              <>
                <Button
                  onClick={handleCancel}
                  variant="outline"
                  className="flex-1 border-zinc-700 text-zinc-300 hover:text-white"
                >
                  Отклонить
                </Button>
                <Button
                  onClick={handleAccept}
                  className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700"
                >
                  <Icon name="Play" size={16} className="mr-2" />
                  Принять
                </Button>
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
