import Header from "@/components/Header";
import Footer from "@/components/Footer";
import TournamentBracket from "@/components/TournamentBracket";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Icon from "@/components/ui/icon";

interface Tournament {
  id: string;
  name: string;
  description: string;
  prizePool: string;
  startDate: string;
  endDate: string;
  participants: number;
  maxParticipants: number;
  status: "upcoming" | "active" | "completed";
  region: string;
}

const tournaments: Tournament[] = [
  {
    id: "1",
    name: "Зимний кубок России",
    description: "Главный турнир зимнего сезона",
    prizePool: "500,000₽",
    startDate: "2024-02-15",
    endDate: "2024-02-25",
    participants: 128,
    maxParticipants: 128,
    status: "upcoming",
    region: "Вся Россия",
  },
  {
    id: "2",
    name: "Московский чемпионат",
    description: "Региональный турнир для команд Москвы",
    prizePool: "100,000₽",
    startDate: "2024-01-20",
    endDate: "2024-01-30",
    participants: 64,
    maxParticipants: 64,
    status: "active",
    region: "Москва",
  },
  {
    id: "3",
    name: "Кубок Сибири",
    description: "Турнир для команд Сибирского региона",
    prizePool: "75,000₽",
    startDate: "2024-01-10",
    endDate: "2024-01-15",
    participants: 32,
    maxParticipants: 32,
    status: "completed",
    region: "Сибирь",
  },
];

const statusColors = {
  upcoming: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  active: "bg-green-500/20 text-green-400 border-green-500/30",
  completed: "bg-gray-500/20 text-gray-400 border-gray-500/30",
};

const statusTexts = {
  upcoming: "Предстоящий",
  active: "Активный",
  completed: "Завершен",
};

export default function Tournaments() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Header />

      <main className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl lg:text-6xl font-bold mb-6">Турниры</h1>
          <p className="text-xl text-zinc-400 max-w-3xl mx-auto">
            Участвуйте в профессиональных турнирах и зарабатывайте призы
          </p>
        </div>

        {/* Активные турниры - Турнирная сетка 1/32 */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold mb-8 text-center">
            Активные турниры
          </h2>
          <div className="mb-6 text-center">
            <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30 text-lg px-4 py-2">
              Зимний чемпионат 2024
            </Badge>
            <p className="text-zinc-400 mt-2">Турнирная сетка на 32 команды</p>
          </div>

          <Card className="bg-zinc-900/30 border-zinc-800">
            <CardHeader>
              <CardTitle className="flex items-center justify-center text-2xl">
                <Icon
                  name="Trophy"
                  size={24}
                  className="mr-2 text-yellow-400"
                />
                Турнирная сетка
              </CardTitle>
            </CardHeader>
            <CardContent>
              <TournamentBracket />
            </CardContent>
          </Card>
        </div>

        {/* Все турниры - Результаты матчей */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold mb-8 text-center">Все турниры</h2>

          <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {/* Результаты матчей */}
            <Card className="bg-zinc-900/50 border-zinc-800">
              <CardHeader>
                <CardTitle className="flex items-center text-xl">
                  <Icon
                    name="Trophy"
                    size={20}
                    className="mr-2 text-yellow-400"
                  />
                  Результаты матчей
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Пустые ячейки для результатов */}
                {Array.from({ length: 8 }, (_, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-3 bg-zinc-800/50 rounded-lg border border-zinc-700"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-zinc-500 rounded-full"></div>
                      <span className="text-zinc-400">TBD vs TBD</span>
                    </div>
                    <div className="text-zinc-500 text-sm">--:--</div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Мини-сетка */}
            <Card className="bg-zinc-900/50 border-zinc-800">
              <CardHeader>
                <CardTitle className="flex items-center text-xl">
                  <Icon name="Zap" size={20} className="mr-2 text-yellow-400" />
                  Турнирная сетка 1/32
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-4 gap-2">
                  {/* Мини версия сетки */}
                  {Array.from({ length: 32 }, (_, i) => (
                    <div
                      key={i}
                      className="aspect-square bg-zinc-800/50 border border-zinc-700 rounded flex items-center justify-center text-xs text-zinc-500"
                    >
                      TBD
                    </div>
                  ))}
                </div>
                <div className="mt-4 text-center">
                  <p className="text-zinc-400 text-sm">
                    32 команды будут бороться за победу
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
