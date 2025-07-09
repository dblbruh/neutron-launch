import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MatchmakingModal from "@/components/MatchmakingModal";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Icon from "@/components/ui/icon";
import { useState } from "react";

interface GameMode {
  id: string;
  name: string;
  description: string;
  players: string;
  duration: string;
  icon: string;
}

const gameModes: GameMode[] = [
  {
    id: "solo",
    name: "Соло игра",
    description: "Играйте в одиночку против других игроков",
    players: "1 vs 1",
    duration: "15-30 мин",
    icon: "User",
  },
  {
    id: "team",
    name: "Игра своей командой",
    description: "Играйте с друзьями в составе команды",
    players: "5 vs 5",
    duration: "30-45 мин",
    icon: "Users",
  },
  {
    id: "tournament",
    name: "Турниры",
    description: "Участвуйте в турнирах и выигрывайте призы",
    players: "5 vs 5",
    duration: "60-90 мин",
    icon: "Trophy",
  },
];

interface RankTier {
  name: string;
  minRating: number;
  maxRating: number;
  cardClass: string;
  textColor: string;
  iconClass: string;
  description: string;
}

const rankTiers: RankTier[] = [
  {
    name: "Новичок",
    minRating: 0,
    maxRating: 1000,
    cardClass:
      "bg-gradient-to-br from-gray-500/20 to-gray-600/20 border-gray-400/40",
    textColor: "text-gray-400",
    iconClass: "from-gray-300 to-gray-500",
    description: "Начальный уровень",
  },
  {
    name: "Бронза",
    minRating: 1001,
    maxRating: 2300,
    cardClass:
      "bg-gradient-to-br from-amber-700/20 to-amber-900/20 border-amber-600/40",
    textColor: "text-amber-600",
    iconClass: "from-amber-600 to-amber-800",
    description: "Изучение основ",
  },
  {
    name: "Серебро",
    minRating: 2301,
    maxRating: 3500,
    cardClass:
      "bg-gradient-to-br from-gray-400/20 to-gray-600/20 border-gray-300/40",
    textColor: "text-gray-300",
    iconClass: "from-gray-300 to-gray-500",
    description: "Уверенная игра",
  },
  {
    name: "Золото",
    minRating: 3501,
    maxRating: 5000,
    cardClass:
      "bg-gradient-to-br from-yellow-400/20 to-yellow-600/20 border-yellow-500/40",
    textColor: "text-yellow-400",
    iconClass: "from-yellow-400 to-yellow-600",
    description: "Опытный игрок",
  },
  {
    name: "Рубин",
    minRating: 5001,
    maxRating: 7000,
    cardClass:
      "bg-gradient-to-br from-red-500/20 to-red-700/20 border-red-500/40",
    textColor: "text-red-400",
    iconClass: "from-red-400 to-red-600",
    description: "Мастер игры",
  },
  {
    name: "Элита",
    minRating: 7001,
    maxRating: 10000,
    cardClass: "bg-gradient-to-br from-black/60 to-gray-900/60 border-white/20",
    textColor: "text-white",
    iconClass: "from-gray-800 to-black",
    description: "Элитный уровень",
  },
  {
    name: "Легенда",
    minRating: 10001,
    maxRating: 999999,
    cardClass:
      "bg-gradient-to-br from-black/80 to-gray-900/80 border-yellow-500/60",
    textColor: "text-yellow-400",
    iconClass: "from-yellow-400 to-yellow-600",
    description: "Легендарный статус",
  },
];

const getCurrentRank = (rating: number): RankTier => {
  return (
    rankTiers.find(
      (tier) => rating >= tier.minRating && rating <= tier.maxRating,
    ) || rankTiers[0]
  );
};

export default function Play() {
  const [isMatchmakingOpen, setIsMatchmakingOpen] = useState(false);
  const [selectedGameMode, setSelectedGameMode] = useState("");

  const handleFindGame = (mode: GameMode) => {
    setSelectedGameMode(mode.name);
    setIsMatchmakingOpen(true);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />

      <main className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl lg:text-6xl font-bold mb-6">Начать игру</h1>
          <p className="text-xl text-zinc-400 max-w-3xl mx-auto">
            Выберите режим игры и найдите достойных соперников
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16">
          {gameModes.map((mode) => (
            <Card
              key={mode.id}
              className="bg-zinc-900/50 border-zinc-800 hover:border-yellow-500 transition-colors cursor-pointer"
            >
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-yellow-400/20 to-yellow-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon
                    name={mode.icon as any}
                    size={32}
                    className="text-yellow-400"
                  />
                </div>
                <CardTitle className="text-2xl font-bold text-white mb-2">
                  {mode.name}
                </CardTitle>
                <CardDescription className="text-zinc-400">
                  {mode.description}
                </CardDescription>
              </CardHeader>

              <CardContent>
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-zinc-400">Игроки:</span>
                    <span className="text-white">{mode.players}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-zinc-400">Время:</span>
                    <span className="text-white">{mode.duration}</span>
                  </div>
                </div>

                <Button
                  onClick={() => handleFindGame(mode)}
                  className="w-full bg-gradient-to-r from-yellow-400 to-yellow-600 text-black hover:from-yellow-500 hover:to-yellow-700"
                  size="lg"
                >
                  <Icon name="Play" size={20} className="mr-2" />
                  Найти игру
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-8 max-w-6xl mx-auto mb-16">
          <h2 className="text-2xl font-bold mb-6 text-center">
            Текущий статус
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-yellow-400">
                Ваш рейтинг
              </h3>
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center">
                  <Icon name="Star" size={24} className="text-black" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">2,847</p>
                  <p className="text-zinc-400">Золотой элит</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-yellow-400">
                Статистика
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-white">156</p>
                  <p className="text-zinc-400 text-sm">Побед</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-white">89</p>
                  <p className="text-zinc-400 text-sm">Поражений</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-white">1.76</p>
                  <p className="text-zinc-400 text-sm">K/D</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-white">63.7%</p>
                  <p className="text-zinc-400 text-sm">Винрейт</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">
            Рейтинговые лиги
          </h2>
          <p className="text-zinc-400 text-center mb-12">
            Прогрессируйте через рейтинговые лиги и получайте эксклюзивные
            награды
          </p>

          <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-6">
            {rankTiers.map((tier, index) => {
              const currentRank = getCurrentRank(2847);
              const isCurrentRank = tier.name === currentRank.name;

              return (
                <Card
                  key={tier.name}
                  className={`${tier.cardClass} ${isCurrentRank ? "ring-2 ring-yellow-400" : ""} transition-all duration-300 hover:scale-105`}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div
                          className={`w-10 h-10 bg-gradient-to-br ${tier.iconClass} rounded-lg flex items-center justify-center`}
                        >
                          {tier.name === "Легенда" ? (
                            <Icon
                              name="Crown"
                              size={20}
                              className="text-black"
                            />
                          ) : (
                            <Icon
                              name="Award"
                              size={20}
                              className="text-black"
                            />
                          )}
                        </div>
                        <div>
                          <h3 className={`text-lg font-bold ${tier.textColor}`}>
                            {tier.name}
                          </h3>
                          <p className="text-zinc-400 text-sm">
                            {tier.description}
                          </p>
                        </div>
                      </div>
                      {isCurrentRank && (
                        <div className="bg-yellow-400/20 px-2 py-1 rounded-full">
                          <span className="text-yellow-400 text-xs font-semibold">
                            ТЕКУЩИЙ
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-zinc-400 text-sm">Рейтинг:</span>
                        <span className="text-white font-semibold">
                          {tier.minRating.toLocaleString()}
                          {tier.maxRating < 999999
                            ? ` - ${tier.maxRating.toLocaleString()}`
                            : "+"}
                        </span>
                      </div>

                      {tier.name === "Легенда" && (
                        <div className="flex items-center space-x-2 pt-2">
                          <Icon
                            name="Crown"
                            size={16}
                            className="text-yellow-400"
                          />
                          <span className="text-yellow-400 text-xs font-semibold">
                            Золотые венки
                          </span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </main>

      <Footer />

      <MatchmakingModal
        isOpen={isMatchmakingOpen}
        onClose={() => setIsMatchmakingOpen(false)}
        gameMode={selectedGameMode}
      />
    </div>
  );
}
