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
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import Icon from "@/components/ui/icon";

interface Friend {
  id: string;
  name: string;
  rank: string;
  status: "online" | "offline" | "playing";
  game?: string;
  avatar: string;
}

const friends: Friend[] = [
  {
    id: "1",
    name: "ProGamer_2024",
    rank: "Золотой элит",
    status: "playing",
    game: "Dust2",
    avatar: "🎮",
  },
  {
    id: "2",
    name: "SniperKing",
    rank: "Серебряный элит",
    status: "online",
    avatar: "🎯",
  },
  {
    id: "3",
    name: "TeamLeader",
    rank: "Мастер-хранитель",
    status: "offline",
    avatar: "👑",
  },
  {
    id: "4",
    name: "RushMaster",
    rank: "Золотая звезда",
    status: "online",
    avatar: "⚡",
  },
  {
    id: "5",
    name: "ClutchMaster",
    rank: "Легендарный орел",
    status: "playing",
    game: "Mirage",
    avatar: "🦅",
  },
];

const statusColors = {
  online: "bg-green-500",
  offline: "bg-gray-500",
  playing: "bg-yellow-500",
};

const statusTexts = {
  online: "В сети",
  offline: "Не в сети",
  playing: "В игре",
};

export default function Friends() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Header />

      <main className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl lg:text-6xl font-bold mb-6">Друзья</h1>
          <p className="text-xl text-zinc-400 max-w-3xl mx-auto">
            Играйте вместе с друзьями и создавайте непобедимые команды
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <div className="flex gap-4 mb-6">
              <Input
                placeholder="Поиск друзей по никнейму..."
                className="flex-1 bg-zinc-900/50 border-zinc-800 text-white placeholder-zinc-500"
              />
              <Button className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-black hover:from-yellow-500 hover:to-yellow-700">
                <Icon name="Search" size={20} className="mr-2" />
                Найти
              </Button>
            </div>

            <div className="flex gap-4">
              <Button className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-black hover:from-yellow-500 hover:to-yellow-700">
                <Icon name="UserPlus" size={20} className="mr-2" />
                Добавить друга
              </Button>
              <Button
                variant="outline"
                className="border-zinc-700 text-zinc-300 hover:text-white"
              >
                <Icon name="Users" size={20} className="mr-2" />
                Создать команду
              </Button>
            </div>
          </div>

          <div className="grid gap-4">
            {friends.map((friend) => (
              <Card
                key={friend.id}
                className="bg-zinc-900/50 border-zinc-800 hover:border-yellow-500 transition-colors"
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="relative">
                        <div className="w-12 h-12 bg-gradient-to-br from-yellow-400/20 to-yellow-600/20 rounded-full flex items-center justify-center text-2xl">
                          {friend.avatar}
                        </div>
                        <div
                          className={`absolute -bottom-1 -right-1 w-4 h-4 ${statusColors[friend.status]} rounded-full border-2 border-black`}
                        ></div>
                      </div>

                      <div>
                        <h3 className="text-lg font-semibold text-white">
                          {friend.name}
                        </h3>
                        <div className="flex items-center space-x-2">
                          <Badge
                            variant="outline"
                            className="text-zinc-400 border-zinc-600"
                          >
                            {friend.rank}
                          </Badge>
                          <span className="text-zinc-400 text-sm">
                            {statusTexts[friend.status]}
                            {friend.game && ` - ${friend.game}`}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      {friend.status === "online" && (
                        <Button
                          size="sm"
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <Icon
                            name="MessageCircle"
                            size={16}
                            className="mr-2"
                          />
                          Написать
                        </Button>
                      )}
                      {friend.status === "playing" && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-zinc-700 text-zinc-300 hover:text-white"
                        >
                          <Icon name="Eye" size={16} className="mr-2" />
                          Смотреть
                        </Button>
                      )}
                      <Button
                        size="sm"
                        className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-black hover:from-yellow-500 hover:to-yellow-700"
                      >
                        <Icon name="UserPlus" size={16} className="mr-2" />
                        Пригласить
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-12 grid md:grid-cols-2 gap-8">
            <Card className="bg-zinc-900/50 border-zinc-800">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-white">
                  <Icon name="Users" size={24} className="mr-2 inline" />
                  Моя команда
                </CardTitle>
                <CardDescription className="text-zinc-400">
                  Создайте команду с друзьями
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-zinc-400 mb-4">У вас пока нет команды</p>
                <Button className="w-full bg-gradient-to-r from-yellow-400 to-yellow-600 text-black hover:from-yellow-500 hover:to-yellow-700">
                  <Icon name="Plus" size={20} className="mr-2" />
                  Создать команду
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-zinc-900/50 border-zinc-800">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-white">
                  <Icon name="Calendar" size={24} className="mr-2 inline" />
                  Недавние игры
                </CardTitle>
                <CardDescription className="text-zinc-400">
                  Игроки из последних матчей
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-300">NicePlayer_123</span>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-zinc-700 text-zinc-400 hover:text-white"
                    >
                      <Icon name="UserPlus" size={16} />
                    </Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-300">FragMaster</span>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-zinc-700 text-zinc-400 hover:text-white"
                    >
                      <Icon name="UserPlus" size={16} />
                    </Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-300">SkillfulGamer</span>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-zinc-700 text-zinc-400 hover:text-white"
                    >
                      <Icon name="UserPlus" size={16} />
                    </Button>
                  </div>
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
