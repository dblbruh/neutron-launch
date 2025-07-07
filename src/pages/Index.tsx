import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import Icon from "@/components/ui/icon";

export default function Index() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-zinc-800 bg-black/95 backdrop-blur supports-[backdrop-filter]:bg-black/60">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <img
                src="/img/a6ee8f4d-26f5-4ec3-ada3-dfa630021d75.jpg"
                alt="CS2 Tournament"
                className="h-8 w-8 rounded"
              />
              <h1 className="text-xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
                CS2 ARENA
              </h1>
            </div>
            <div className="hidden md:flex items-center space-x-6">
              <a
                href="#"
                className="text-zinc-300 hover:text-white transition-colors"
              >
                Главная
              </a>
              <a
                href="#"
                className="text-zinc-300 hover:text-white transition-colors"
              >
                Турниры
              </a>
              <a
                href="#"
                className="text-zinc-300 hover:text-white transition-colors"
              >
                Рейтинг
              </a>
              <a
                href="#"
                className="text-zinc-300 hover:text-white transition-colors"
              >
                Магазин
              </a>
              <a
                href="#"
                className="text-zinc-300 hover:text-white transition-colors"
              >
                Новости
              </a>
            </div>
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                size="sm"
                className="border-zinc-700 text-zinc-300 hover:text-white"
              >
                <Icon name="LogIn" size={16} className="mr-2" />
                Войти
              </Button>
              <Button
                size="sm"
                className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-black hover:from-yellow-500 hover:to-yellow-700"
              >
                Подписка 150₽
              </Button>
            </div>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
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
              подбор игроков, региональные рейтинги и призы от собранных
              подписок.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
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
          </div>
        </div>
      </section>

      {/* Tournament Info */}
      <section className="py-16 bg-zinc-900/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold mb-4">Как проходит турнир</h3>
            <p className="text-zinc-400 max-w-2xl mx-auto">
              Турнир проводится в несколько этапов с честным подбором игроков и
              региональными отборами
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-zinc-800/50 border-zinc-700">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 w-12 h-12 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center">
                  <span className="text-black font-bold text-lg">1</span>
                </div>
                <CardTitle className="text-white">Онлайн отбор</CardTitle>
                <CardDescription className="text-zinc-400">
                  1 месяц
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-zinc-300">
                  5 лучших игроков из каждого региона России получают
                  приглашение
                </p>
              </CardContent>
            </Card>

            <Card className="bg-zinc-800/50 border-zinc-700">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 w-12 h-12 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center">
                  <span className="text-black font-bold text-lg">2</span>
                </div>
                <CardTitle className="text-white">Финальный отбор</CardTitle>
                <CardDescription className="text-zinc-400">
                  До 32 команд
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-zinc-300">
                  Онлайн турнир среди приглашенных до определения 32 лучших
                  команд
                </p>
              </CardContent>
            </Card>

            <Card className="bg-zinc-800/50 border-zinc-700">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 w-12 h-12 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center">
                  <span className="text-black font-bold text-lg">3</span>
                </div>
                <CardTitle className="text-white">LAN финал</CardTitle>
                <CardDescription className="text-zinc-400">
                  Главный турнир
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-zinc-300">
                  Очный турнир между 32 лучшими командами за главный приз
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Subscription & Features */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-3xl font-bold mb-6">Подписка за 150₽</h3>
              <p className="text-zinc-400 mb-8 text-lg">
                Получите доступ к турнирам, честному подбору игроков и
                возможности выиграть призы
              </p>

              <div className="space-y-4 mb-8">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full"></div>
                  <span className="text-zinc-300">Участие в турнирах</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full"></div>
                  <span className="text-zinc-300">
                    Честный подбор по рейтингу
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full"></div>
                  <span className="text-zinc-300">Региональные рейтинги</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full"></div>
                  <span className="text-zinc-300">
                    Призовой фонд от подписок
                  </span>
                </div>
              </div>

              <Button
                size="lg"
                className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-black hover:from-yellow-500 hover:to-yellow-700 text-lg px-8"
              >
                <Icon name="CreditCard" size={20} className="mr-2" />
                Оформить подписку
              </Button>
            </div>

            <div>
              <Card className="bg-zinc-800/50 border-zinc-700">
                <CardHeader>
                  <CardTitle className="text-white">Без подписки</CardTitle>
                  <CardDescription className="text-zinc-400">
                    Играйте бесплатно и повышайте свой рейтинг
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <Icon name="Check" size={16} className="text-green-400" />
                      <span className="text-zinc-300">Обычные матчи</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Icon name="Check" size={16} className="text-green-400" />
                      <span className="text-zinc-300">Рейтинговая система</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Icon name="Check" size={16} className="text-green-400" />
                      <span className="text-zinc-300">Статистика игр</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Icon name="X" size={16} className="text-red-400" />
                      <span className="text-zinc-500">Турниры</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Regional Leaderboards */}
      <section className="py-16 bg-zinc-900/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold mb-4">Рейтинги по регионам</h3>
            <p className="text-zinc-400 max-w-2xl mx-auto">
              Следите за лучшими игроками вашего региона и всей России
            </p>
          </div>

          <Tabs defaultValue="moscow" className="w-full">
            <TabsList className="grid grid-cols-4 w-full max-w-md mx-auto mb-8 bg-zinc-800">
              <TabsTrigger
                value="moscow"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-yellow-400 data-[state=active]:to-yellow-600 data-[state=active]:text-black"
              >
                Москва
              </TabsTrigger>
              <TabsTrigger
                value="spb"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-yellow-400 data-[state=active]:to-yellow-600 data-[state=active]:text-black"
              >
                СПб
              </TabsTrigger>
              <TabsTrigger
                value="ekb"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-yellow-400 data-[state=active]:to-yellow-600 data-[state=active]:text-black"
              >
                Екб
              </TabsTrigger>
              <TabsTrigger
                value="nsk"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-yellow-400 data-[state=active]:to-yellow-600 data-[state=active]:text-black"
              >
                Нск
              </TabsTrigger>
            </TabsList>

            <TabsContent value="moscow" className="space-y-4">
              <Card className="bg-zinc-800/50 border-zinc-700">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {[
                      {
                        rank: 1,
                        name: "s1mple_ru",
                        rating: 2847,
                        matches: 156,
                      },
                      {
                        rank: 2,
                        name: "electronic_msc",
                        rating: 2734,
                        matches: 143,
                      },
                      {
                        rank: 3,
                        name: "sh1ro_legend",
                        rating: 2689,
                        matches: 132,
                      },
                      {
                        rank: 4,
                        name: "perfecto_aim",
                        rating: 2567,
                        matches: 128,
                      },
                      {
                        rank: 5,
                        name: "boombl4_igl",
                        rating: 2445,
                        matches: 119,
                      },
                    ].map((player) => (
                      <div
                        key={player.rank}
                        className="flex items-center justify-between p-4 bg-zinc-700/30 rounded-lg"
                      >
                        <div className="flex items-center space-x-4">
                          <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center">
                            <span className="text-black font-bold text-sm">
                              {player.rank}
                            </span>
                          </div>
                          <div>
                            <p className="text-white font-semibold">
                              {player.name}
                            </p>
                            <p className="text-zinc-400 text-sm">
                              {player.matches} матчей
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-white font-bold">
                            {player.rating}
                          </p>
                          <p className="text-zinc-400 text-sm">рейтинг</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="spb" className="space-y-4">
              <Card className="bg-zinc-800/50 border-zinc-700">
                <CardContent className="p-6">
                  <div className="text-center text-zinc-400">
                    <p>Рейтинг игроков Санкт-Петербурга</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="ekb" className="space-y-4">
              <Card className="bg-zinc-800/50 border-zinc-700">
                <CardContent className="p-6">
                  <div className="text-center text-zinc-400">
                    <p>Рейтинг игроков Екатеринбурга</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="nsk" className="space-y-4">
              <Card className="bg-zinc-800/50 border-zinc-700">
                <CardContent className="p-6">
                  <div className="text-center text-zinc-400">
                    <p>Рейтинг игроков Новосибирска</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Store Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold mb-4">Магазин</h3>
            <p className="text-zinc-400 max-w-2xl mx-auto">
              Приобретайте игровые предметы и улучшения для своего профиля
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-zinc-800/50 border-zinc-700 hover:border-yellow-500 transition-colors">
              <CardHeader>
                <div className="w-full h-32 bg-gradient-to-br from-yellow-400/20 to-yellow-600/20 rounded-lg flex items-center justify-center mb-4">
                  <Icon name="Shield" size={48} className="text-yellow-400" />
                </div>
                <CardTitle className="text-white">Премиум статус</CardTitle>
                <CardDescription className="text-zinc-400">
                  Расширенные функции профиля
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center space-x-2">
                    <Icon name="Check" size={16} className="text-green-400" />
                    <span className="text-zinc-300 text-sm">
                      Золотой значок
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Icon name="Check" size={16} className="text-green-400" />
                    <span className="text-zinc-300 text-sm">
                      Эксклюзивные аватары
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Icon name="Check" size={16} className="text-green-400" />
                    <span className="text-zinc-300 text-sm">
                      Приоритет в матчах
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-white">299₽</span>
                  <Button
                    size="sm"
                    className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-black hover:from-yellow-500 hover:to-yellow-700"
                  >
                    Купить
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-zinc-800/50 border-zinc-700 hover:border-yellow-500 transition-colors">
              <CardHeader>
                <div className="w-full h-32 bg-gradient-to-br from-yellow-400/20 to-yellow-600/20 rounded-lg flex items-center justify-center mb-4">
                  <Icon name="Star" size={48} className="text-yellow-400" />
                </div>
                <CardTitle className="text-white">Boost рейтинга</CardTitle>
                <CardDescription className="text-zinc-400">
                  Ускорьте прокачку рейтинга
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center space-x-2">
                    <Icon name="Check" size={16} className="text-green-400" />
                    <span className="text-zinc-300 text-sm">
                      +50% к рейтингу
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Icon name="Check" size={16} className="text-green-400" />
                    <span className="text-zinc-300 text-sm">
                      Действует 7 дней
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Icon name="Check" size={16} className="text-green-400" />
                    <span className="text-zinc-300 text-sm">
                      Стакается с другими
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-white">299₽</span>
                  <Button
                    size="sm"
                    className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-black hover:from-yellow-500 hover:to-yellow-700"
                  >
                    Купить
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-zinc-800/50 border-zinc-700 hover:border-yellow-500 transition-colors">
              <CardHeader>
                <div className="w-full h-32 bg-gradient-to-br from-yellow-400/20 to-yellow-600/20 rounded-lg flex items-center justify-center mb-4">
                  <Icon name="Users" size={48} className="text-yellow-400" />
                </div>
                <CardTitle className="text-white">Команда месяца</CardTitle>
                <CardDescription className="text-zinc-400">
                  Создайте команду с друзьями
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center space-x-2">
                    <Icon name="Check" size={16} className="text-green-400" />
                    <span className="text-zinc-300 text-sm">
                      Командный рейтинг
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Icon name="Check" size={16} className="text-green-400" />
                    <span className="text-zinc-300 text-sm">Закрытый чат</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Icon name="Check" size={16} className="text-green-400" />
                    <span className="text-zinc-300 text-sm">
                      Статистика команды
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-white">499₽</span>
                  <Button
                    size="sm"
                    className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-black hover:from-yellow-500 hover:to-yellow-700"
                  >
                    Купить
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-zinc-900 border-t border-zinc-800">
        <div className="container mx-auto px-4 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <img
                  src="/img/a6ee8f4d-26f5-4ec3-ada3-dfa630021d75.jpg"
                  alt="CS2 Tournament"
                  className="h-8 w-8 rounded"
                />
                <h4 className="text-xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
                  CS2 ARENA
                </h4>
              </div>
              <p className="text-zinc-400">
                Профессиональная киберспортивная платформа для турниров по CS2
              </p>
            </div>

            <div>
              <h5 className="text-white font-semibold mb-4">Турниры</h5>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#"
                    className="text-zinc-400 hover:text-white transition-colors"
                  >
                    Текущие турниры
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-zinc-400 hover:text-white transition-colors"
                  >
                    Расписание
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-zinc-400 hover:text-white transition-colors"
                  >
                    Архив
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h5 className="text-white font-semibold mb-4">Сообщество</h5>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#"
                    className="text-zinc-400 hover:text-white transition-colors"
                  >
                    Рейтинги
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-zinc-400 hover:text-white transition-colors"
                  >
                    Форум
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-zinc-400 hover:text-white transition-colors"
                  >
                    Discord
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h5 className="text-white font-semibold mb-4">Поддержка</h5>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#"
                    className="text-zinc-400 hover:text-white transition-colors"
                  >
                    Правила
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-zinc-400 hover:text-white transition-colors"
                  >
                    FAQ
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-zinc-400 hover:text-white transition-colors"
                  >
                    Контакты
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-zinc-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-zinc-400 text-sm">
              © 2024 CS2 ARENA. Все права защищены.
            </p>
            <div className="flex items-center space-x-4 mt-4 md:mt-0">
              <a
                href="#"
                className="text-zinc-400 hover:text-white transition-colors"
              >
                <Icon name="MessageCircle" size={20} />
              </a>
              <a
                href="#"
                className="text-zinc-400 hover:text-white transition-colors"
              >
                <Icon name="Youtube" size={20} />
              </a>
              <a
                href="#"
                className="text-zinc-400 hover:text-white transition-colors"
              >
                <Icon name="Twitter" size={20} />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
