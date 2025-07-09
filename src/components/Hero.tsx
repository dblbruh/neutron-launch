import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Icon from "@/components/ui/icon";
import PlayerStats from "@/components/PlayerStats";

export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent z-10"></div>
      <img
        src="/img/ac38b80e-19db-43d1-a9f1-6361bf8739ca.jpg"
        alt="Gaming Setup"
        className="absolute inset-0 w-full h-full object-cover opacity-40"
      />
      <div className="relative z-20 container mx-auto px-4 py-24 lg:py-32">
        <div className="max-w-3xl">
          <h2 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight">
            Профессиональные
            <span className="block bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
              CS2 турниры
            </span>
          </h2>
          <p className="text-xl text-zinc-300 mb-8 leading-relaxed">
            Участвуйте в крупнейших турнирах России. Отборочные туры, честный
            подбор игроков, региональные рейтинги и призы от собранных подписок.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 mb-12">
            <Button
              size="lg"
              className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-black hover:from-yellow-500 hover:to-yellow-700 text-lg px-8"
            >
              <Icon name="Play" size={20} className="mr-2" />
              Начать играть
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-zinc-700 text-zinc-300 hover:text-white text-lg px-8"
            >
              <Icon name="Trophy" size={20} className="mr-2" />
              Турниры
            </Button>
          </div>
          <PlayerStats />
        </div>
      </div>

      {/* Блоки с информацией о матчах */}
      <div className="relative z-20 container mx-auto px-4 pb-16">
        <div className="grid lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {/* Последние матчи */}
          <Card className="bg-zinc-900/80 border-zinc-800 backdrop-blur">
            <CardHeader>
              <CardTitle className="flex items-center text-lg text-white">
                <Icon name="Clock" size={20} className="mr-2 text-yellow-400" />
                Последние матчи
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-zinc-800/50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <div>
                    <div className="text-white font-medium">NaVi vs Gambit</div>
                    <div className="text-zinc-400 text-sm">Dust2 • 16:12</div>
                  </div>
                </div>
                <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                  Завершен
                </Badge>
              </div>

              <div className="flex items-center justify-between p-3 bg-zinc-800/50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                  <div>
                    <div className="text-white font-medium">Spirit vs VP</div>
                    <div className="text-zinc-400 text-sm">Mirage • 12:8</div>
                  </div>
                </div>
                <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                  Идет
                </Badge>
              </div>

              <div className="flex items-center justify-between p-3 bg-zinc-800/50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                  <div>
                    <div className="text-white font-medium">
                      Forze vs Cloud9
                    </div>
                    <div className="text-zinc-400 text-sm">Inferno • 20:30</div>
                  </div>
                </div>
                <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30">
                  Скоро
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Популярные турниры */}
          <Card className="bg-zinc-900/80 border-zinc-800 backdrop-blur">
            <CardHeader>
              <CardTitle className="flex items-center text-lg text-white">
                <Icon
                  name="Trophy"
                  size={20}
                  className="mr-2 text-yellow-400"
                />
                Популярные турниры
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="p-3 bg-zinc-800/50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-white font-medium">Зимний чемпионат</div>
                  <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                    Приз 500к
                  </Badge>
                </div>
                <div className="text-zinc-400 text-sm mb-2">
                  64 команды • Полуфинал
                </div>
                <div className="w-full bg-zinc-700 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-yellow-400 to-yellow-600 h-2 rounded-full"
                    style={{ width: "75%" }}
                  ></div>
                </div>
              </div>

              <div className="p-3 bg-zinc-800/50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-white font-medium">Лига новичков</div>
                  <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                    Приз 50к
                  </Badge>
                </div>
                <div className="text-zinc-400 text-sm mb-2">
                  128 команд • Групповой этап
                </div>
                <div className="w-full bg-zinc-700 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-green-400 to-green-600 h-2 rounded-full"
                    style={{ width: "45%" }}
                  ></div>
                </div>
              </div>

              <div className="p-3 bg-zinc-800/50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-white font-medium">Про-лига</div>
                  <Badge className="bg-red-500/20 text-red-400 border-red-500/30">
                    Приз 1М
                  </Badge>
                </div>
                <div className="text-zinc-400 text-sm mb-2">
                  16 команд • Отбор
                </div>
                <div className="w-full bg-zinc-700 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-red-400 to-red-600 h-2 rounded-full"
                    style={{ width: "20%" }}
                  ></div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Статистика сегодня */}
          <Card className="bg-zinc-900/80 border-zinc-800 backdrop-blur">
            <CardHeader>
              <CardTitle className="flex items-center text-lg text-white">
                <Icon
                  name="BarChart"
                  size={20}
                  className="mr-2 text-yellow-400"
                />
                Статистика сегодня
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Icon name="Users" size={16} className="text-blue-400" />
                  <span className="text-zinc-400">Онлайн сейчас</span>
                </div>
                <span className="text-white font-bold">3,247</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Icon name="Play" size={16} className="text-green-400" />
                  <span className="text-zinc-400">Матчей сегодня</span>
                </div>
                <span className="text-white font-bold">1,892</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Icon name="Trophy" size={16} className="text-yellow-400" />
                  <span className="text-zinc-400">Турниров активно</span>
                </div>
                <span className="text-white font-bold">12</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Icon name="Award" size={16} className="text-purple-400" />
                  <span className="text-zinc-400">Призов выдано</span>
                </div>
                <span className="text-white font-bold">847к ₽</span>
              </div>

              <div className="pt-2 border-t border-zinc-700">
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-400 mb-1">
                    98.7%
                  </div>
                  <div className="text-zinc-400 text-sm">
                    Удовлетворенность игроков
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
