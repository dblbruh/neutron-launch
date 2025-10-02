import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Icon from "@/components/ui/icon";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import funcUrls from "../../backend/func2url.json";

interface UserProfile {
  id: number;
  username: string;
  displayName: string;
  avatarUrl?: string;
  points: number;
  level: number;
  wins: number;
  losses: number;
  winRate: number;
  kdRatio: number;
  totalMatches: number;
  memberSince?: string;
}

interface MatchHistory {
  id: string;
  map: string;
  result: "win" | "loss";
  score: string;
  kills: number;
  deaths: number;
  assists: number;
  date: string;
}

const matchHistory: MatchHistory[] = [];

export default function Profile() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated || !user) {
      navigate('/login');
      return;
    }

    const loadProfile = async () => {
      const profileUrl = funcUrls.profile as string;
      const response = await fetch(`${profileUrl}?user_id=${user.id}`);
      
      if (!response.ok) {
        setError('Не удалось загрузить профиль');
        setLoading(false);
        return;
      }
      
      const data = await response.json();
      setProfile(data);
      setLoading(false);
    };

    loadProfile();
  }, [user, isAuthenticated, navigate]);
  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white">
        <Header />
        <main className="container mx-auto px-4 py-16 flex items-center justify-center">
          <div className="text-center">
            <Icon name="Loader2" size={48} className="animate-spin mx-auto mb-4 text-yellow-400" />
            <p className="text-zinc-400">Загрузка профиля...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-black text-white">
        <Header />
        <main className="container mx-auto px-4 py-16 flex items-center justify-center">
          <div className="text-center">
            <Icon name="AlertCircle" size={48} className="mx-auto mb-4 text-red-400" />
            <p className="text-zinc-400">{error || 'Профиль не найден'}</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="relative mb-12">
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-600/20 via-yellow-400/20 to-yellow-600/20 rounded-3xl blur-3xl"></div>
            <Card className="relative bg-gradient-to-br from-zinc-900 via-zinc-900 to-yellow-900/20 border-yellow-500/30 overflow-hidden">
              <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-yellow-400/10 to-transparent rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-yellow-600/10 to-transparent rounded-full blur-3xl"></div>

              <CardContent className="p-8 md:p-12 relative z-10">
                <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
                  <div className="relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-2xl blur opacity-50 group-hover:opacity-75 transition"></div>
                    <div className="relative w-32 h-32 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-2xl flex items-center justify-center shadow-2xl">
                      {profile.avatarUrl ? (
                        <img src={profile.avatarUrl} alt={profile.displayName} className="w-full h-full rounded-2xl object-cover" />
                      ) : (
                        <Icon name="User" size={64} className="text-black" />
                      )}
                    </div>
                  </div>

                  <div className="flex-1 text-center md:text-left">
                    <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
                      <h1 className="text-4xl md:text-5xl font-bold text-white">
                        {profile.displayName}
                      </h1>
                      <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/50 px-3 py-1">
                        Ур. {profile.level}
                      </Badge>
                    </div>
                    <p className="text-yellow-400/80 text-lg mb-6">@{profile.username}</p>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
                      <div className="bg-black/30 rounded-xl p-4 backdrop-blur-sm border border-yellow-500/20">
                        <div className="flex items-center justify-center mb-2">
                          <Icon name="Trophy" size={24} className="text-yellow-400" />
                        </div>
                        <div className="text-3xl font-bold text-white text-center">{profile.points}</div>
                        <div className="text-sm text-zinc-400 text-center mt-1">Рейтинг</div>
                      </div>

                      <div className="bg-black/30 rounded-xl p-4 backdrop-blur-sm border border-yellow-500/20">
                        <div className="flex items-center justify-center mb-2">
                          <Icon name="Zap" size={24} className="text-green-400" />
                        </div>
                        <div className="text-3xl font-bold text-white text-center">{profile.winRate}%</div>
                        <div className="text-sm text-zinc-400 text-center mt-1">Винрейт</div>
                      </div>

                      <div className="bg-black/30 rounded-xl p-4 backdrop-blur-sm border border-yellow-500/20">
                        <div className="flex items-center justify-center mb-2">
                          <Icon name="Target" size={24} className="text-blue-400" />
                        </div>
                        <div className="text-3xl font-bold text-white text-center">{profile.kdRatio.toFixed(2)}</div>
                        <div className="text-sm text-zinc-400 text-center mt-1">K/D</div>
                      </div>

                      <div className="bg-black/30 rounded-xl p-4 backdrop-blur-sm border border-yellow-500/20">
                        <div className="flex items-center justify-center mb-2">
                          <Icon name="Gamepad2" size={24} className="text-purple-400" />
                        </div>
                        <div className="text-3xl font-bold text-white text-center">{profile.totalMatches}</div>
                        <div className="text-sm text-zinc-400 text-center mt-1">Матчей</div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                      <div className="flex items-center gap-2 bg-green-500/10 border border-green-500/30 rounded-lg px-4 py-2">
                        <Icon name="TrendingUp" size={20} className="text-green-400" />
                        <span className="text-white font-semibold">{profile.wins}</span>
                        <span className="text-zinc-400 text-sm">побед</span>
                      </div>
                      <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-2">
                        <Icon name="TrendingDown" size={20} className="text-red-400" />
                        <span className="text-white font-semibold">{profile.losses}</span>
                        <span className="text-zinc-400 text-sm">поражений</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 mb-8">
            <Card className="bg-zinc-900/50 border-zinc-800 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-white flex items-center">
                  <Icon name="TrendingUp" size={28} className="mr-3 text-yellow-400" />
                  График рейтинга
                </CardTitle>
                <CardDescription className="text-zinc-400">
                  Изменение рейтинга за последний месяц
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-end justify-between space-x-2">
                  {[
                    2750, 2780, 2720, 2850, 2800, 2840, 2790, 2820, 2870, 2847,
                  ].map((rating, index) => {
                    const height = ((rating - 2700) / 200) * 100;
                    return (
                      <div
                        key={index}
                        className="flex flex-col items-center flex-1"
                      >
                        <div className="text-xs text-zinc-400 mb-1">{rating}</div>
                        <div
                          className="w-full bg-gradient-to-t from-yellow-400 to-yellow-600 rounded-t transition-all duration-300 hover:from-yellow-300 hover:to-yellow-500 cursor-pointer"
                          style={{ height: `${height}%`, minHeight: "10px" }}
                        ></div>
                        <div className="text-xs text-zinc-500 mt-1">
                          {index + 1}
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="mt-6 flex justify-between items-center">
                  <div className="text-sm text-zinc-400">Пик: <span className="text-white font-semibold">2,870</span></div>
                  <div className="text-sm text-zinc-400">Текущий: <span className="text-white font-semibold">2,847</span></div>
                  <div className="text-sm text-green-400 font-semibold">+97 за месяц</div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-zinc-900/50 border-zinc-800 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-white flex items-center">
                  <Icon name="BarChart3" size={28} className="mr-3 text-yellow-400" />
                  Детальная статистика
                </CardTitle>
                <CardDescription className="text-zinc-400">
                  Подробные показатели игрока
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-black/30 rounded-lg border border-zinc-700/50">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                        <Icon name="Award" size={20} className="text-green-400" />
                      </div>
                      <span className="text-zinc-300">Победы</span>
                    </div>
                    <span className="text-2xl font-bold text-white">{profile.wins}</span>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-black/30 rounded-lg border border-zinc-700/50">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center">
                        <Icon name="X" size={20} className="text-red-400" />
                      </div>
                      <span className="text-zinc-300">Поражения</span>
                    </div>
                    <span className="text-2xl font-bold text-white">{profile.losses}</span>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-black/30 rounded-lg border border-zinc-700/50">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                        <Icon name="Percent" size={20} className="text-blue-400" />
                      </div>
                      <span className="text-zinc-300">Процент побед</span>
                    </div>
                    <span className="text-2xl font-bold text-white">{profile.winRate}%</span>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-black/30 rounded-lg border border-zinc-700/50">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                        <Icon name="Crosshair" size={20} className="text-purple-400" />
                      </div>
                      <span className="text-zinc-300">K/D соотношение</span>
                    </div>
                    <span className="text-2xl font-bold text-white">{profile.kdRatio.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-zinc-900/50 border-zinc-800 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-white flex items-center">
                <Icon name="Clock" size={28} className="mr-3 text-yellow-400" />
                История матчей
              </CardTitle>
              <CardDescription className="text-zinc-400">
                Последние 5 игр
              </CardDescription>
            </CardHeader>
            <CardContent>
              {matchHistory.length === 0 ? (
                <div className="text-center py-16">
                  <div className="relative inline-block">
                    <div className="absolute inset-0 bg-yellow-400/20 rounded-full blur-2xl"></div>
                    <Icon name="Gamepad2" size={64} className="relative mx-auto mb-4 text-yellow-400/50" />
                  </div>
                  <p className="text-zinc-300 text-lg font-medium mb-2">История матчей пуста</p>
                  <p className="text-zinc-500 text-sm">Сыграйте свой первый матч, чтобы увидеть статистику</p>
                  <Button 
                    onClick={() => navigate('/matchmaking')}
                    className="mt-6 bg-gradient-to-r from-yellow-400 to-yellow-600 text-black hover:from-yellow-300 hover:to-yellow-500"
                  >
                    <Icon name="Swords" size={20} className="mr-2" />
                    Найти матч
                  </Button>
                </div>
              ) : (
                <>
                  <div className="space-y-4">
                    {matchHistory.map((match) => (
                      <div
                        key={match.id}
                        className={`p-4 rounded-lg border transition-all hover:scale-[1.02] cursor-pointer ${
                          match.result === "win"
                            ? "bg-green-500/10 border-green-500/30 hover:border-green-500/50"
                            : "bg-red-500/10 border-red-500/30 hover:border-red-500/50"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div
                              className={`w-3 h-3 rounded-full ${
                                match.result === "win"
                                  ? "bg-green-500"
                                  : "bg-red-500"
                              }`}
                            ></div>
                            <div>
                              <h4 className="font-semibold text-white">
                                {match.map}
                              </h4>
                              <p className="text-zinc-400 text-sm">
                                {match.result === "win" ? "Победа" : "Поражение"} -{" "}
                                {match.score}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center space-x-6">
                            <div className="text-center">
                              <p className="text-lg font-bold text-white">
                                {match.kills}
                              </p>
                              <p className="text-zinc-400 text-xs">Убийств</p>
                            </div>
                            <div className="text-center">
                              <p className="text-lg font-bold text-white">
                                {match.deaths}
                              </p>
                              <p className="text-zinc-400 text-xs">Смертей</p>
                            </div>
                            <div className="text-center">
                              <p className="text-lg font-bold text-white">
                                {match.assists}
                              </p>
                              <p className="text-zinc-400 text-xs">Помощи</p>
                            </div>
                            <div className="text-center">
                              <p className="text-lg font-bold text-white">
                                {(match.kills / match.deaths).toFixed(1)}
                              </p>
                              <p className="text-zinc-400 text-xs">K/D</p>
                            </div>
                            <div className="text-right">
                              <p className="text-zinc-400 text-sm">{match.date}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 text-center">
                    <Button
                      variant="outline"
                      className="border-zinc-700 text-zinc-300 hover:text-white hover:border-zinc-600"
                    >
                      <Icon name="MoreHorizontal" size={20} className="mr-2" />
                      Показать больше
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}
