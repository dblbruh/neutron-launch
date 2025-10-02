import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import Icon from "@/components/ui/icon";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import funcUrls from "../../backend/func2url.json";

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

interface Challenge {
  id: number;
  creator: {
    id: number;
    username: string;
    displayName: string;
  };
  opponent: {
    id: number;
    username: string;
    displayName: string;
  } | null;
  game_mode: string;
  stake: number;
  reward: number;
  status: string;
  created_at: string;
}

export default function Challenges() {
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [selectedType, setSelectedType] = useState("1v1");
  const [betAmount, setBetAmount] = useState("");
  const [activeChallenges, setActiveChallenges] = useState<Challenge[]>([]);
  const [myChallenges, setMyChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  const selectedChallenge = challengeTypes.find(t => t.id === selectedType);
  const calculatedReward = betAmount ? Math.floor(Number(betAmount) * 1.8) : 0;

  useEffect(() => {
    loadChallenges();
    if (isAuthenticated && user) {
      loadMyChallenges();
    }

    const interval = setInterval(() => {
      loadChallenges();
      if (isAuthenticated && user) {
        loadMyChallenges();
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [isAuthenticated, user]);

  const loadChallenges = async () => {
    try {
      const response = await fetch(`${funcUrls.content}?resource=challenges&status=open`);
      if (response.ok) {
        const data = await response.json();
        setActiveChallenges(data);
      }
    } catch (error) {
      console.error('Failed to load challenges:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadMyChallenges = async () => {
    if (!user) return;
    
    try {
      const response = await fetch(`${funcUrls.content}?resource=challenges&user_id=${user.id}`);
      if (response.ok) {
        const data = await response.json();
        setMyChallenges(data);
      }
    } catch (error) {
      console.error('Failed to load my challenges:', error);
    }
  };

  const handleCreateChallenge = async () => {
    if (!isAuthenticated || !user) {
      toast({
        title: "Требуется авторизация",
        description: "Войдите чтобы создать вызов",
        variant: "destructive"
      });
      return;
    }

    if (!betAmount || Number(betAmount) < selectedChallenge!.minBet) {
      toast({
        title: "Неверная ставка",
        description: `Минимальная ставка: ${selectedChallenge!.minBet} очков`,
        variant: "destructive"
      });
      return;
    }

    if (Number(betAmount) > user.points) {
      toast({
        title: "Недостаточно очков",
        description: "Пополните баланс в магазине",
        variant: "destructive"
      });
      return;
    }

    setCreating(true);
    try {
      const response = await fetch(`${funcUrls.content}?resource=challenges`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'create',
          creator_id: user.id,
          game_mode: selectedType,
          stake: Number(betAmount)
        })
      });

      if (response.ok) {
        toast({
          title: "Вызов создан!",
          description: `Ожидайте соперника в режиме ${selectedChallenge!.name}`
        });
        setBetAmount("");
        loadChallenges();
        loadMyChallenges();
      } else {
        throw new Error('Failed to create challenge');
      }
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось создать вызов",
        variant: "destructive"
      });
    } finally {
      setCreating(false);
    }
  };

  const handleCancelChallenge = async (challengeId: number) => {
    if (!user) return;

    try {
      const response = await fetch(`${funcUrls.content}?resource=challenges`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'cancel',
          challenge_id: challengeId,
          user_id: user.id
        })
      });

      if (response.ok) {
        toast({
          title: "Вызов отменён"
        });
        loadChallenges();
        loadMyChallenges();
      }
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось отменить вызов",
        variant: "destructive"
      });
    }
  };

  const handleAcceptChallenge = async (challengeId: number) => {
    if (!isAuthenticated || !user) {
      toast({
        title: "Требуется авторизация",
        description: "Войдите чтобы принять вызов",
        variant: "destructive"
      });
      return;
    }

    const challenge = activeChallenges.find(c => c.id === challengeId);
    if (challenge && challenge.stake > user.points) {
      toast({
        title: "Недостаточно очков",
        description: "Пополните баланс в магазине",
        variant: "destructive"
      });
      return;
    }

    try {
      const response = await fetch(`${funcUrls.content}?resource=challenges`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'accept',
          challenge_id: challengeId,
          user_id: user.id
        })
      });

      if (response.ok) {
        toast({
          title: "Вызов принят!",
          description: "Матч начинается..."
        });
        loadChallenges();
      }
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось принять вызов",
        variant: "destructive"
      });
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-black text-white">
        <Header />
        <main className="container mx-auto px-4 py-8 text-center">
          <Icon name="Lock" size={64} className="mx-auto mb-6 text-zinc-600" />
          <h2 className="text-2xl font-bold mb-4">Требуется авторизация</h2>
          <p className="text-zinc-400 mb-6">Войдите чтобы создавать и принимать вызовы</p>
          <Link to="/login">
            <Button className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-black hover:from-yellow-500 hover:to-yellow-700">
              <Icon name="LogIn" size={16} className="mr-2" />
              Войти
            </Button>
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Вызовы
          </h1>
          <p className="text-zinc-400">
            Создавайте матчи со ставками или принимайте вызовы других игроков
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <Card className="bg-zinc-900 border-zinc-800 sticky top-4">
              <CardHeader>
                <CardTitle className="flex items-center text-white">
                  <Icon name="Plus" size={20} className="mr-2 text-yellow-400" />
                  Создать вызов
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
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
                          <Icon name={type.icon} size={16} className="mr-2 text-yellow-400" />
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
                  disabled={!betAmount || Number(betAmount) < (selectedChallenge?.minBet || 0) || creating}
                >
                  {creating ? (
                    <>
                      <Icon name="Loader2" size={16} className="mr-2 animate-spin" />
                      Создание...
                    </>
                  ) : (
                    'Создать вызов'
                  )}
                </Button>

                <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                  <div className="flex items-center mb-1">
                    <Icon name="Coins" size={16} className="mr-2 text-yellow-400" />
                    <span className="text-sm font-medium text-white">
                      Баланс: {user?.points.toLocaleString()} очков
                    </span>
                  </div>
                  <p className="text-xs text-zinc-400">
                    Очки начисляются за победы и можно купить в магазине
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-2 space-y-6">
            {myChallenges.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
                  <Icon name="User" size={20} className="mr-2 text-yellow-400" />
                  Мои вызовы
                </h2>
                <div className="space-y-4">
                  {myChallenges.map((challenge) => {
                    const type = challengeTypes.find(t => t.id === challenge.game_mode)!;
                    
                    return (
                      <Card key={challenge.id} className="bg-zinc-900 border-zinc-800">
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <div className={cn("p-3 rounded-lg bg-gradient-to-r", type.color)}>
                                <Icon name={type.icon} size={24} className="text-white" />
                              </div>
                              
                              <div>
                                <div className="flex items-center space-x-2 mb-1">
                                  <h3 className="font-semibold text-white">{type.name}</h3>
                                  <Badge className={cn(
                                    challenge.status === 'open' 
                                      ? 'bg-green-500/20 text-green-400 border-green-500/30' 
                                      : 'bg-blue-500/20 text-blue-400 border-blue-500/30',
                                    'text-xs'
                                  )}>
                                    {challenge.status === 'open' ? 'Ожидает' : 'В игре'}
                                  </Badge>
                                </div>
                                <p className="text-xs text-zinc-500">{type.description}</p>
                              </div>
                            </div>

                            <div className="text-right flex items-center space-x-4">
                              <div>
                                <div className="text-lg font-bold text-white">
                                  {challenge.stake} очков
                                </div>
                                <div className="text-sm text-green-400">
                                  Выигрыш: {challenge.reward}
                                </div>
                              </div>
                              
                              {challenge.status === 'open' && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleCancelChallenge(challenge.id)}
                                  className="border-red-600 text-red-400 hover:bg-red-900/20"
                                >
                                  <Icon name="X" size={16} className="mr-1" />
                                  Отменить
                                </Button>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            )}

            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-white">
                  Активные вызовы
                </h2>
                <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                  {activeChallenges.length} доступно
                </Badge>
              </div>

              {loading ? (
                <div className="flex justify-center py-12">
                  <Icon name="Loader2" size={48} className="animate-spin text-yellow-400" />
                </div>
              ) : activeChallenges.length === 0 ? (
                <Card className="bg-zinc-900/50 border-zinc-800">
                  <CardContent className="p-12 text-center">
                    <Icon name="Inbox" size={64} className="mx-auto mb-4 text-zinc-600" />
                    <p className="text-zinc-400 mb-2">Нет активных вызовов</p>
                    <p className="text-sm text-zinc-500">Создайте первый вызов!</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {activeChallenges.filter(c => c.creator.id !== user?.id).map((challenge) => {
                    const type = challengeTypes.find(t => t.id === challenge.game_mode)!;
                    
                    return (
                      <Card key={challenge.id} className="bg-zinc-900 border-zinc-800 hover:border-zinc-700 transition-colors">
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <div className={cn("p-3 rounded-lg bg-gradient-to-r", type.color)}>
                                <Icon name={type.icon} size={24} className="text-white" />
                              </div>
                              
                              <div>
                                <div className="flex items-center space-x-2 mb-1">
                                  <h3 className="font-semibold text-white">{type.name}</h3>
                                  <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-xs">
                                    Ожидает
                                  </Badge>
                                </div>
                                <p className="text-sm text-zinc-400">
                                  Создал: <Link to={`/user/${challenge.creator.username}`} className="text-white hover:text-yellow-400">{challenge.creator.displayName}</Link>
                                </p>
                                <p className="text-xs text-zinc-500">{type.description}</p>
                              </div>
                            </div>

                            <div className="text-right flex items-center space-x-4">
                              <div>
                                <div className="text-lg font-bold text-white">
                                  {challenge.stake} очков
                                </div>
                                <div className="text-sm text-green-400">
                                  Выигрыш: {challenge.reward}
                                </div>
                              </div>
                              
                              <Button 
                                size="sm" 
                                onClick={() => handleAcceptChallenge(challenge.id)}
                                className="bg-yellow-500 hover:bg-yellow-600 text-black"
                              >
                                <Icon name="Zap" size={16} className="mr-1" />
                                Принять
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
