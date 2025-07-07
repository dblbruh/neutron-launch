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

const matchHistory: MatchHistory[] = [
  {
    id: "1",
    map: "Dust2",
    result: "win",
    score: "16:12",
    kills: 24,
    deaths: 16,
    assists: 8,
    date: "2024-01-15",
  },
  {
    id: "2",
    map: "Mirage",
    result: "loss",
    score: "14:16",
    kills: 19,
    deaths: 18,
    assists: 12,
    date: "2024-01-14",
  },
  {
    id: "3",
    map: "Inferno",
    result: "win",
    score: "16:8",
    kills: 28,
    deaths: 12,
    assists: 6,
    date: "2024-01-13",
  },
  {
    id: "4",
    map: "Cache",
    result: "win",
    score: "16:11",
    kills: 21,
    deaths: 15,
    assists: 9,
    date: "2024-01-12",
  },
  {
    id: "5",
    map: "Overpass",
    result: "loss",
    score: "13:16",
    kills: 16,
    deaths: 19,
    assists: 11,
    date: "2024-01-11",
  },
];

export default function Profile() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Header />

      <main className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-8 mb-8">
            <Card className="bg-zinc-900/50 border-zinc-800">
              <CardHeader className="text-center">
                <div className="w-24 h-24 bg-gradient-to-br from-yellow-400/20 to-yellow-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon name="User" size={48} className="text-yellow-400" />
                </div>
                <CardTitle className="text-2xl font-bold text-white">
                  ProGamer_2024
                </CardTitle>
                <CardDescription className="text-zinc-400">
                  Золотой элит мастер
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-zinc-400">Рейтинг:</span>
                    <span className="text-2xl font-bold text-yellow-400">
                      2,847
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-zinc-400">Регион:</span>
                    <span className="text-white">Москва</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-zinc-400">Команда:</span>
                    <span className="text-white">FireStorm</span>
                  </div>
                </div>
                <Button className="w-full mt-6 bg-gradient-to-r from-yellow-400 to-yellow-600 text-black hover:from-yellow-500 hover:to-yellow-700">
                  <Icon name="Edit" size={20} className="mr-2" />
                  Редактировать
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-zinc-900/50 border-zinc-800">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-white">
                  <Icon name="Target" size={24} className="mr-2 inline" />
                  Статистика
                </CardTitle>
              </CardHeader>
              <CardContent>
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
                  <div className="text-center">
                    <p className="text-2xl font-bold text-white">83.4</p>
                    <p className="text-zinc-400 text-sm">ADR</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-white">0.71</p>
                    <p className="text-zinc-400 text-sm">KPR</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-white">0.40</p>
                    <p className="text-zinc-400 text-sm">DPR</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-white">42.3%</p>
                    <p className="text-zinc-400 text-sm">HS%</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-zinc-900/50 border-zinc-800">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-white">
                  <Icon name="Award" size={24} className="mr-2 inline" />
                  Достижения
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Badge className="w-full justify-start bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                    <Icon name="Trophy" size={16} className="mr-2" />
                    Первая победа
                  </Badge>
                  <Badge className="w-full justify-start bg-blue-500/20 text-blue-400 border-blue-500/30">
                    <Icon name="Target" size={16} className="mr-2" />
                    Снайпер
                  </Badge>
                  <Badge className="w-full justify-start bg-green-500/20 text-green-400 border-green-500/30">
                    <Icon name="Users" size={16} className="mr-2" />
                    Командный игрок
                  </Badge>
                  <Badge className="w-full justify-start bg-purple-500/20 text-purple-400 border-purple-500/30">
                    <Icon name="Flame" size={16} className="mr-2" />
                    Серия побед
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-zinc-900/50 border-zinc-800 mb-8">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-white">
                <Icon name="TrendingUp" size={24} className="mr-2 inline" />
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
                        className="w-full bg-gradient-to-t from-yellow-400 to-yellow-600 rounded-t transition-all duration-300 hover:from-yellow-300 hover:to-yellow-500"
                        style={{ height: `${height}%`, minHeight: "10px" }}
                      ></div>
                      <div className="text-xs text-zinc-500 mt-1">
                        {index + 1}
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="mt-4 flex justify-between items-center">
                <div className="text-sm text-zinc-400">Пик: 2,870</div>
                <div className="text-sm text-zinc-400">Текущий: 2,847</div>
                <div className="text-sm text-green-400">+97 за месяц</div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-zinc-900/50 border-zinc-800">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-white">
                <Icon name="Clock" size={24} className="mr-2 inline" />
                История матчей
              </CardTitle>
              <CardDescription className="text-zinc-400">
                Последние 5 игр
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {matchHistory.map((match) => (
                  <div
                    key={match.id}
                    className={`p-4 rounded-lg border transition-colors ${
                      match.result === "win"
                        ? "bg-green-500/10 border-green-500/30"
                        : "bg-red-500/10 border-red-500/30"
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
                  className="border-zinc-700 text-zinc-300 hover:text-white"
                >
                  <Icon name="MoreHorizontal" size={20} className="mr-2" />
                  Показать больше
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}
