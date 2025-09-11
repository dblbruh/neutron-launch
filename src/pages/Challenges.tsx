import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import Icon from "@/components/ui/icon";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { cn } from "@/lib/utils";

const challengeTypes = [
  {
    id: "1v1",
    name: "1 на 1",
    description: "Дуэль на карте de_aim_map2",
    minBet: 10,
    maxBet: 1000,
    icon: "User",
    color: "from-blue-500 to-blue-700",
  },
  {
    id: "2v2",
    name: "2 на 2",
    description: "Командная игра на де_dust2",
    minBet: 50,
    maxBet: 2500,
    icon: "Users",
    color: "from-green-500 to-green-700",
  },
  {
    id: "5v5",
    name: "5 на 5",
    description: "Полноценный матч по правилам ESL",
    minBet: 100,
    maxBet: 5000,
    icon: "Users2",
    color: "from-purple-500 to-purple-700",
  },
];

const activeChallenges = [
  {
    id: 1,
    type: "1v1",
    creator: "ProGamer2024",
    bet: 250,
    reward: 450,
    status: "waiting",
    timeLeft: "14:32",
  },
  {
    id: 2,
    type: "5v5",
    creator: "TeamAlpha",
    bet: 500,
    reward: 900,
    status: "waiting",
    timeLeft: "08:15",
  },
  {
    id: 3,
    type: "2v2",
    creator: "DuoKings",
    bet: 150,
    reward: 270,
    status: "in_progress",
    timeLeft: "Live",
  },
];

export default function Challenges() {
  const [selectedType, setSelectedType] = useState("1v1");
  const [betAmount, setBetAmount] = useState("");

  const selectedChallenge = challengeTypes.find(t => t.id === selectedType);
  const calculatedReward = betAmount ? Math.floor(Number(betAmount) * 1.8) : 0;

  const handleCreateChallenge = () => {
    if (!betAmount || Number(betAmount) < selectedChallenge!.minBet) {
      return;
    }
    console.log(`Creating ${selectedType} challenge with bet: ${betAmount}`);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Ежедневные вызовы
          </h1>
          <p className="text-zinc-400">
            Создавайте собственные матчи со ставками или присоединяйтесь к существующим
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Создание вызова */}
          <div className="lg:col-span-1">
            <Card className="bg-zinc-900 border-zinc-800 sticky top-4">
              <CardHeader>
                <CardTitle className="flex items-center text-white">
                  <Icon name="Plus" size={20} className="mr-2 text-yellow-400" />
                  Создать вызов
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Выбор типа игры */}
                <div>
                  <label className="text-sm font-medium text-zinc-300 mb-3 block">
                    Формат игры
                  </label>
                  <div className="space-y-2">
                    {challengeTypes.map((type) => (
                      <button
                        key={type.id}
                        onClick={() => setSelectedType(type.id)}
                        className={cn(
                          "w-full p-3 rounded-lg border transition-all text-left",
                          selectedType === type.id
                            ? "border-yellow-500 bg-yellow-500/10"
                            : "border-zinc-700 hover:border-zinc-600"
                        )}
                      >
                        <div className="flex items-center mb-2">
                          <Icon name={type.icon as any} size={16} className="mr-2 text-yellow-400" />
                          <span className="font-medium text-white">{type.name}</span>
                        </div>
                        <p className="text-xs text-zinc-400">{type.description}</p>
                        <p className="text-xs text-zinc-500 mt-1">
                          Ставка: {type.minBet}-{type.maxBet} очков
                        </p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Размер ставки */}
                <div>
                  <label className="text-sm font-medium text-zinc-300 mb-2 block">
                    Размер ставки
                  </label>
                  <Input
                    type="number"
                    placeholder={`От ${selectedChallenge?.minBet} до ${selectedChallenge?.maxBet}`}
                    value={betAmount}
                    onChange={(e) => setBetAmount(e.target.value)}
                    className="bg-zinc-800 border-zinc-700 text-white"
                    min={selectedChallenge?.minBet}
                    max={selectedChallenge?.maxBet}
                  />
                  {betAmount && (
                    <div className="mt-2 p-2 bg-zinc-800/50 rounded text-sm">
                      <div className="flex justify-between text-zinc-300">
                        <span>При победе:</span>
                        <span className="text-green-400 font-medium">
                          +{calculatedReward} очков
                        </span>
                      </div>
                      <div className="flex justify-between text-zinc-500 text-xs">
                        <span>Комиссия (10%):</span>
                        <span>-{Math.floor(Number(betAmount) * 0.2)} очков</span>
                      </div>
                    </div>
                  )}
                </div>

                <Button 
                  onClick={handleCreateChallenge}
                  className="w-full bg-gradient-to-r from-yellow-400 to-yellow-600 text-black hover:from-yellow-500 hover:to-yellow-700"
                  disabled={!betAmount || Number(betAmount) < (selectedChallenge?.minBet || 0)}
                >
                  Создать вызов
                </Button>

                <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                  <div className="flex items-center mb-1">
                    <Icon name="Info" size={16} className="mr-2 text-blue-400" />
                    <span className="text-sm font-medium text-blue-400">
                      Баланс очков: 2,450
                    </span>
                  </div>
                  <p className="text-xs text-zinc-400">
                    Очки начисляются за победы в турнирах и можно купить в магазине
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Список активных вызовов */}
          <div className="lg:col-span-2">
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-white">
                  Активные вызовы
                </h2>
                <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                  {activeChallenges.length} доступно
                </Badge>
              </div>
            </div>

            <div className="space-y-4">
              {activeChallenges.map((challenge) => {
                const type = challengeTypes.find(t => t.id === challenge.type)!;
                
                return (
                  <Card key={challenge.id} className="bg-zinc-900 border-zinc-800">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className={cn(
                            "p-3 rounded-lg bg-gradient-to-r",
                            type.color
                          )}>
                            <Icon name={type.icon as any} size={24} className="text-white" />
                          </div>
                          
                          <div>
                            <div className="flex items-center space-x-2 mb-1">
                              <h3 className="font-semibold text-white">
                                {type.name}
                              </h3>
                              {challenge.status === "in_progress" ? (
                                <Badge className="bg-red-500/20 text-red-400 border-red-500/30 text-xs">
                                  В игре
                                </Badge>
                              ) : (
                                <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-xs">
                                  Ожидает
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-zinc-400">
                              Создал: <span className="text-white">{challenge.creator}</span>
                            </p>
                            <p className="text-xs text-zinc-500">
                              {type.description}
                            </p>
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="mb-2">
                            <div className="text-lg font-bold text-white">
                              {challenge.bet} очков
                            </div>
                            <div className="text-sm text-green-400">
                              Выигрыш: {challenge.reward}
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            {challenge.status === "in_progress" ? (
                              <Badge className="bg-red-500/20 text-red-400 border-red-500/30">
                                <Icon name="Play" size={12} className="mr-1" />
                                {challenge.timeLeft}
                              </Badge>
                            ) : (
                              <>
                                <Badge className="bg-zinc-700 text-zinc-300">
                                  <Icon name="Clock" size={12} className="mr-1" />
                                  {challenge.timeLeft}
                                </Badge>
                                <Button 
                                  size="sm" 
                                  className="bg-yellow-500 hover:bg-yellow-600 text-black"
                                >
                                  Принять
                                </Button>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Статистика */}
            <Card className="bg-zinc-900 border-zinc-800 mt-8">
              <CardHeader>
                <CardTitle className="flex items-center text-white">
                  <Icon name="BarChart" size={20} className="mr-2 text-yellow-400" />
                  Статистика вызовов
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white mb-1">247</div>
                    <div className="text-sm text-zinc-400">Матчей сегодня</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-400 mb-1">89%</div>
                    <div className="text-sm text-zinc-400">Процент завершения</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-400 mb-1">18.2k</div>
                    <div className="text-sm text-zinc-400">Очков в игре</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-400 mb-1">156</div>
                    <div className="text-sm text-zinc-400">Активных игроков</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}