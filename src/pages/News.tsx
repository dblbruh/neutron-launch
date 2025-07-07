import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Icon from "@/components/ui/icon";

interface NewsItem {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  category: string;
  image: string;
  featured?: boolean;
}

const newsItems: NewsItem[] = [
  {
    id: "1",
    title: "Стартует зимний сезон турниров 2024",
    excerpt:
      "Призовой фонд увеличен до 2 млн рублей. Регистрация команд уже открыта.",
    content: "Полный текст новости...",
    date: "2024-01-20",
    category: "Турниры",
    image: "🏆",
    featured: true,
  },
  {
    id: "2",
    title: "Новые региональные лиги",
    excerpt: "Добавлены лиги для Сибири, Урала и Дальнего Востока.",
    content: "Полный текст новости...",
    date: "2024-01-18",
    category: "Обновления",
    image: "🌍",
  },
  {
    id: "3",
    title: "Обновление системы рейтингов",
    excerpt: "Новый алгоритм расчета рейтинга учитывает командную игру.",
    content: "Полный текст новости...",
    date: "2024-01-15",
    category: "Система",
    image: "📊",
  },
  {
    id: "4",
    title: "Интервью с чемпионами",
    excerpt: "Команда FireStorm рассказывает о своих секретах успеха.",
    content: "Полный текст новости...",
    date: "2024-01-12",
    category: "Интервью",
    image: "🎤",
  },
  {
    id: "5",
    title: "Новые карты в турнирном пуле",
    excerpt: "Ancient и Vertigo добавлены в официальный пул карт.",
    content: "Полный текст новости...",
    date: "2024-01-10",
    category: "Игра",
    image: "🗺️",
  },
];

const categoryColors = {
  Турниры: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  Обновления: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  Система: "bg-green-500/20 text-green-400 border-green-500/30",
  Интервью: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  Игра: "bg-red-500/20 text-red-400 border-red-500/30",
};

export default function News() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Header />

      <main className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl lg:text-6xl font-bold mb-6">Новости</h1>
          <p className="text-xl text-zinc-400 max-w-3xl mx-auto">
            Все последние новости о турнирах, обновлениях и киберспорте
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          {newsItems.map((item, index) => (
            <Card
              key={item.id}
              className={`mb-8 bg-zinc-900/50 border-zinc-800 hover:border-yellow-500 transition-colors ${
                item.featured && index === 0 ? "border-yellow-500" : ""
              }`}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-yellow-400/20 to-yellow-600/20 rounded-lg flex items-center justify-center text-2xl">
                      {item.image}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <Badge
                          className={
                            categoryColors[
                              item.category as keyof typeof categoryColors
                            ]
                          }
                        >
                          {item.category}
                        </Badge>
                        {item.featured && (
                          <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                            <Icon name="Star" size={12} className="mr-1" />
                            Важное
                          </Badge>
                        )}
                      </div>
                      <CardTitle className="text-xl font-bold text-white mb-2">
                        {item.title}
                      </CardTitle>
                      <CardDescription className="text-zinc-400">
                        {item.excerpt}
                      </CardDescription>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-zinc-500 text-sm">{item.date}</p>
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 text-zinc-400">
                    <div className="flex items-center space-x-1">
                      <Icon name="Eye" size={16} />
                      <span className="text-sm">1.2k</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Icon name="MessageCircle" size={16} />
                      <span className="text-sm">24</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Icon name="Share2" size={16} />
                      <span className="text-sm">Поделиться</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button className="text-yellow-400 hover:text-yellow-300 transition-colors">
                      <Icon name="Bookmark" size={16} />
                    </button>
                    <button className="text-zinc-400 hover:text-white transition-colors">
                      <Icon name="ExternalLink" size={16} />
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-16 grid lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <Card className="bg-zinc-900/50 border-zinc-800">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-white">
                <Icon name="Bell" size={24} className="mr-2 inline" />
                Подписаться на новости
              </CardTitle>
              <CardDescription className="text-zinc-400">
                Получайте уведомления о важных событиях
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <input type="checkbox" className="rounded" />
                  <span className="text-zinc-300">Турниры</span>
                </div>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" className="rounded" />
                  <span className="text-zinc-300">Обновления</span>
                </div>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" className="rounded" />
                  <span className="text-zinc-300">Интервью</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-zinc-900/50 border-zinc-800">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-white">
                <Icon name="TrendingUp" size={24} className="mr-2 inline" />
                Популярные теги
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                <Badge
                  variant="outline"
                  className="border-zinc-700 text-zinc-400"
                >
                  #турниры
                </Badge>
                <Badge
                  variant="outline"
                  className="border-zinc-700 text-zinc-400"
                >
                  #cs2
                </Badge>
                <Badge
                  variant="outline"
                  className="border-zinc-700 text-zinc-400"
                >
                  #команды
                </Badge>
                <Badge
                  variant="outline"
                  className="border-zinc-700 text-zinc-400"
                >
                  #рейтинг
                </Badge>
                <Badge
                  variant="outline"
                  className="border-zinc-700 text-zinc-400"
                >
                  #обновления
                </Badge>
                <Badge
                  variant="outline"
                  className="border-zinc-700 text-zinc-400"
                >
                  #интервью
                </Badge>
                <Badge
                  variant="outline"
                  className="border-zinc-700 text-zinc-400"
                >
                  #призы
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}
