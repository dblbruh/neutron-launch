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

      {/* Информационные блоки */}
      <div className="relative z-20 container mx-auto px-4 pb-16">
        <div className="grid lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {/* Twitch стрим */}
          <Card className="bg-zinc-900/80 border-zinc-800 backdrop-blur lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center text-lg text-white">
                <Icon name="Video" size={20} className="mr-2 text-purple-400" />
                Прямая трансляция матчей
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div
                className="relative bg-zinc-800 rounded-lg overflow-hidden cursor-pointer group"
                style={{ aspectRatio: "16/9" }}
                onClick={() => window.open('https://www.twitch.tv/dblbruh', '_blank')}
              >
                <div className="w-full h-full bg-gradient-to-br from-purple-900/40 to-blue-900/40 flex flex-col items-center justify-center">
                  <Icon name="Play" size={48} className="text-purple-400 group-hover:text-purple-300 transition-colors mb-4" />
                  <div className="text-center">
                    <div className="text-white font-medium text-lg mb-2">Смотреть на Twitch</div>
                    <div className="text-zinc-300 text-sm">Нажмите для перехода к прямой трансляции</div>
                  </div>
                </div>
                <div className="absolute top-3 left-3">
                  <Badge className="bg-red-500/80 text-white border-red-500">
                    <div className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></div>
                    В эфире
                  </Badge>
                </div>
                <div className="absolute bottom-3 left-3 right-3">
                  <div className="bg-black/70 backdrop-blur rounded p-2">
                    <div className="text-white font-medium text-sm">
                      Зимний чемпионат 2024
                    </div>
                    <div className="text-zinc-300 text-xs">
                      Полуфинал • 64 команды
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Активный турнир */}
          <Card className="bg-zinc-900/80 border-zinc-800 backdrop-blur">
            <CardHeader>
              <CardTitle className="flex items-center text-lg text-white">
                <Icon
                  name="Trophy"
                  size={20}
                  className="mr-2 text-yellow-400"
                />
                Активный турнир
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-zinc-800/50 rounded-lg border border-yellow-500/20">
                <div className="flex items-center justify-between mb-3">
                  <div className="text-white font-medium">Зимний чемпионат</div>
                  <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                    Основной
                  </Badge>
                </div>
                <div className="text-zinc-400 text-sm mb-3">
                  64 команды • Полуфинал
                </div>
                <div className="w-full bg-zinc-700 rounded-full h-2 mb-3">
                  <div
                    className="bg-gradient-to-r from-yellow-400 to-yellow-600 h-2 rounded-full"
                    style={{ width: "75%" }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs text-zinc-400">
                  <span>Прогресс: 75%</span>
                  <span>3 дня осталось</span>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-zinc-400 text-sm">Участников:</span>
                  <span className="text-white font-medium">64/64</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-zinc-400 text-sm">Матчей сыграно:</span>
                  <span className="text-white font-medium">48/63</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-zinc-400 text-sm">Следующий матч:</span>
                  <span className="text-white font-medium">20:30</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Статистика платформы */}
        <div className="mt-8">
          <Card className="bg-zinc-900/80 border-zinc-800 backdrop-blur">
            <CardHeader>
              <CardTitle className="flex items-center text-lg text-white justify-center">
                <Icon
                  name="BarChart"
                  size={20}
                  className="mr-2 text-yellow-400"
                />
                Статистика платформы
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <Icon name="Users" size={20} className="text-blue-400" />
                  </div>
                  <div className="text-2xl font-bold text-white mb-1">
                    3,247
                  </div>
                  <div className="text-zinc-400 text-sm">Онлайн сейчас</div>
                </div>

                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <Icon name="Play" size={20} className="text-green-400" />
                  </div>
                  <div className="text-2xl font-bold text-white mb-1">
                    1,892
                  </div>
                  <div className="text-zinc-400 text-sm">Матчей сегодня</div>
                </div>

                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <Icon name="Trophy" size={20} className="text-yellow-400" />
                  </div>
                  <div className="text-2xl font-bold text-white mb-1">12</div>
                  <div className="text-zinc-400 text-sm">Активных турниров</div>
                </div>

                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <Icon name="Award" size={20} className="text-purple-400" />
                  </div>
                  <div className="text-2xl font-bold text-yellow-400 mb-1">
                    98.7%
                  </div>
                  <div className="text-zinc-400 text-sm">Удовлетворенность</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}