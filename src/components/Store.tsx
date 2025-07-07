import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Icon from "@/components/ui/icon";

interface StoreItem {
  id: string;
  title: string;
  description: string;
  price: number;
  icon: string;
  features: string[];
}

const storeItems: StoreItem[] = [
  {
    id: "premium",
    title: "Премиум статус",
    description: "Расширенные функции профиля",
    price: 299,
    icon: "Shield",
    features: ["Золотой значок", "Эксклюзивные аватары", "Приоритет в матчах"],
  },
  {
    id: "rating-boost",
    title: "Boost рейтинга",
    description: "Ускорьте прокачку рейтинга",
    price: 199,
    icon: "Star",
    features: ["+50% к рейтингу", "Действует 7 дней", "Стакается с другими"],
  },
  {
    id: "team-package",
    title: "Команда месяца",
    description: "Создайте команду с друзьями",
    price: 499,
    icon: "Users",
    features: ["Командный рейтинг", "Закрытый чат", "Статистика команды"],
  },
];

function StoreItemCard({ item }: { item: StoreItem }) {
  return (
    <Card className="bg-zinc-800/50 border-zinc-700 hover:border-yellow-500 transition-colors">
      <CardHeader>
        <div className="w-full h-32 bg-gradient-to-br from-yellow-400/20 to-yellow-600/20 rounded-lg flex items-center justify-center mb-4">
          <Icon name={item.icon as any} size={48} className="text-yellow-400" />
        </div>
        <CardTitle className="text-white">{item.title}</CardTitle>
        <CardDescription className="text-zinc-400">
          {item.description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 mb-4">
          {item.features.map((feature, index) => (
            <div key={index} className="flex items-center space-x-2">
              <Icon name="Check" size={16} className="text-green-400" />
              <span className="text-zinc-300 text-sm">{feature}</span>
            </div>
          ))}
        </div>
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-white">{item.price}₽</span>
          <Button
            size="sm"
            className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-black hover:from-yellow-500 hover:to-yellow-700"
          >
            Купить
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default function Store() {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold mb-4">Магазин</h3>
          <p className="text-zinc-400 max-w-2xl mx-auto">
            Приобретайте игровые предметы и улучшения для своего профиля
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {storeItems.map((item) => (
            <StoreItemCard key={item.id} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
}
