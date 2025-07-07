import Header from "@/components/Header";
import Footer from "@/components/Footer";
import TournamentInfo from "@/components/TournamentInfo";
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

        <TournamentInfo />

        <div className="mt-16">
          <h2 className="text-3xl font-bold mb-8 text-center">Все турниры</h2>

          <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {tournaments.map((tournament) => (
              <Card
                key={tournament.id}
                className="bg-zinc-900/50 border-zinc-800 hover:border-yellow-500 transition-colors"
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-xl font-bold text-white mb-2">
                        {tournament.name}
                      </CardTitle>
                      <CardDescription className="text-zinc-400">
                        {tournament.description}
                      </CardDescription>
                    </div>
                    <Badge className={statusColors[tournament.status]}>
                      {statusTexts[tournament.status]}
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-zinc-400">Призовой фонд:</span>
                      <span className="text-2xl font-bold text-yellow-400">
                        {tournament.prizePool}
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-zinc-400">Регион:</span>
                      <span className="text-white">{tournament.region}</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-zinc-400">Участники:</span>
                      <span className="text-white">
                        {tournament.participants}/{tournament.maxParticipants}
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-zinc-400">Даты:</span>
                      <span className="text-white">
                        {tournament.startDate} - {tournament.endDate}
                      </span>
                    </div>

                    <div className="pt-4">
                      {tournament.status === "upcoming" && (
                        <Button className="w-full bg-gradient-to-r from-yellow-400 to-yellow-600 text-black hover:from-yellow-500 hover:to-yellow-700">
                          <Icon name="UserPlus" size={20} className="mr-2" />
                          Зарегистрироваться
                        </Button>
                      )}
                      {tournament.status === "active" && (
                        <Button className="w-full bg-green-600 hover:bg-green-700">
                          <Icon name="Eye" size={20} className="mr-2" />
                          Смотреть турнир
                        </Button>
                      )}
                      {tournament.status === "completed" && (
                        <Button
                          variant="outline"
                          className="w-full border-zinc-700 text-zinc-300 hover:text-white"
                        >
                          <Icon name="Trophy" size={20} className="mr-2" />
                          Результаты
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="mt-16 bg-zinc-900/50 border border-zinc-800 rounded-lg p-8 max-w-4xl mx-auto">
          <h3 className="text-2xl font-bold mb-6 text-center">
            Как участвовать в турнирах
          </h3>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-400/20 to-yellow-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon name="Users" size={24} className="text-yellow-400" />
              </div>
              <h4 className="text-lg font-semibold mb-2">
                1. Создайте команду
              </h4>
              <p className="text-zinc-400">Соберите команду из 5 игроков</p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-400/20 to-yellow-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon name="Target" size={24} className="text-yellow-400" />
              </div>
              <h4 className="text-lg font-semibold mb-2">2. Пройдите отбор</h4>
              <p className="text-zinc-400">Играйте рейтинговые матчи</p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-400/20 to-yellow-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon name="Trophy" size={24} className="text-yellow-400" />
              </div>
              <h4 className="text-lg font-semibold mb-2">3. Участвуйте</h4>
              <p className="text-zinc-400">Сражайтесь за призы</p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
