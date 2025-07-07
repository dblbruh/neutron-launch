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
import Icon from "@/components/ui/icon";

interface GameMode {
  id: string;
  name: string;
  description: string;
  players: string;
  duration: string;
  icon: string;
  difficulty: "easy" | "medium" | "hard";
}

const gameModes: GameMode[] = [
  {
    id: "solo",
    name: "Соло игра",
    description: "Играйте в одиночку против других игроков",
    players: "1 vs 1",
    duration: "15-30 мин",
    icon: "User",
    difficulty: "easy",
  },
  {
    id: "team",
    name: "Игра своей командой",
    description: "Играйте с друзьями в составе команды",
    players: "5 vs 5",
    duration: "30-45 мин",
    icon: "Users",
    difficulty: "medium",
  },
  {
    id: "tournament",
    name: "Турниры",
    description: "Участвуйте в турнирах и выигрывайте призы",
    players: "5 vs 5",
    duration: "60-90 мин",
    icon: "Trophy",
    difficulty: "hard",
  },
];

const difficultyColors = {
  easy: "text-green-400",
  medium: "text-yellow-400",
  hard: "text-red-400",
};

export default function Play() {
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
                  <div className="flex justify-between items-center">
                    <span className="text-zinc-400">Сложность:</span>
                    <span
                      className={`font-semibold ${difficultyColors[mode.difficulty]}`}
                    >
                      {mode.difficulty === "easy" && "Легкая"}
                      {mode.difficulty === "medium" && "Средняя"}
                      {mode.difficulty === "hard" && "Сложная"}
                    </span>
                  </div>
                </div>

                <Button
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

        <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-8 max-w-4xl mx-auto">
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
      </main>

      <Footer />
    </div>
  );
}
