import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import Icon from "@/components/ui/icon";
import { useState } from "react";

interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  features: string[];
  icon: string;
  popular?: boolean;
}

interface Skin {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  rarity: "common" | "rare" | "epic" | "legendary";
}

const products: Product[] = [
  {
    id: "team-registration",
    name: "Регистрация команды",
    price: 149,
    description: "Официальная регистрация вашей команды в системе",
    features: [
      "Официальный статус команды",
      "Участие в рейтинговых матчах",
      "Логотип команды",
      "Статистика команды",
      "Приоритетный поиск соперников",
    ],
    icon: "Users",
  },
  {
    id: "premium",
    name: "Премиум",
    price: 199,
    description: "Расширенные возможности для игроков",
    features: [
      "Приоритетная поддержка",
      "Эксклюзивные скины",
      "Дополнительная статистика",
      "Без рекламы",
      "Ранний доступ к обновлениям",
      "Премиум значок",
    ],
    icon: "Crown",
    popular: true,
  },
  {
    id: "tournament",
    name: "Подписка на турниры",
    price: 499,
    description: "Доступ к участию в турнирах с призовыми",
    features: [
      "Участие во всех турнирах",
      "Денежные призы",
      "Эксклюзивные трофеи",
      "Турнирная статистика",
      "Профессиональные матчи",
      "Прямые трансляции",
    ],
    icon: "Trophy",
  },
];

const skins: Skin[] = [
  {
    id: "classic-red",
    name: "Классическая красная",
    price: 50,
    description: "Стандартная красная форма команды",
    image: "🔴",
    rarity: "common",
  },
  {
    id: "neon-blue",
    name: "Неоновая синяя",
    price: 120,
    description: "Яркая синяя форма с неоновыми элементами",
    image: "🔵",
    rarity: "rare",
  },
  {
    id: "golden-elite",
    name: "Золотая элита",
    price: 250,
    description: "Престижная золотая форма для топ-игроков",
    image: "🟡",
    rarity: "epic",
  },
  {
    id: "diamond-legend",
    name: "Алмазная легенда",
    price: 500,
    description: "Легендарная алмазная форма высшего ранга",
    image: "💎",
    rarity: "legendary",
  },
];

const rarityColors = {
  common: "text-gray-400 border-gray-400",
  rare: "text-blue-400 border-blue-400",
  epic: "text-purple-400 border-purple-400",
  legendary: "text-yellow-400 border-yellow-400",
};

const rarityLabels = {
  common: "Обычная",
  rare: "Редкая",
  epic: "Эпическая",
  legendary: "Легендарная",
};

export default function Store() {
  const [playerPoints] = useState(1560); // Моксим баллы игрока

  return (
    <div className="space-y-16">
      {/* Основные продукты */}
      <section>
        <h2 className="text-3xl font-bold mb-8 text-center">
          Основные продукты
        </h2>
        <div className="grid lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <Card
              key={product.id}
              className={`bg-zinc-900/50 border-zinc-800 hover:border-yellow-500 transition-all duration-300 ${
                product.popular ? "ring-2 ring-yellow-400" : ""
              }`}
            >
              <CardHeader className="text-center">
                {product.popular && (
                  <Badge className="w-fit mx-auto mb-4 bg-gradient-to-r from-yellow-400 to-yellow-600 text-black">
                    Популярное
                  </Badge>
                )}
                <div className="w-16 h-16 bg-gradient-to-br from-yellow-400/20 to-yellow-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon
                    name={product.icon as any}
                    size={32}
                    className="text-yellow-400"
                  />
                </div>
                <CardTitle className="text-2xl font-bold text-white">
                  {product.name}
                </CardTitle>
                <CardDescription className="text-zinc-400">
                  {product.description}
                </CardDescription>
              </CardHeader>

              <CardContent>
                <div className="text-center mb-6">
                  <span className="text-4xl font-bold text-white">
                    {product.price}₽
                  </span>
                </div>

                <div className="space-y-3 mb-6">
                  {product.features.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <Icon
                        name="Check"
                        size={16}
                        className="text-green-400 flex-shrink-0"
                      />
                      <span className="text-zinc-300 text-sm">{feature}</span>
                    </div>
                  ))}
                </div>

                <Button
                  className="w-full bg-gradient-to-r from-yellow-400 to-yellow-600 text-black hover:from-yellow-500 hover:to-yellow-700"
                  size="lg"
                >
                  <Icon name="ShoppingCart" size={20} className="mr-2" />
                  Купить
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <Separator className="bg-zinc-800" />

      {/* Скины за баллы */}
      <section>
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-4">Скины за баллы</h2>
          <p className="text-zinc-400 mb-6">
            Используйте заработанные в матчах баллы для покупки эксклюзивных
            скинов
          </p>
          <div className="inline-flex items-center space-x-2 bg-zinc-800/50 px-4 py-2 rounded-lg">
            <Icon name="Coins" size={20} className="text-yellow-400" />
            <span className="text-white font-semibold">
              Ваши баллы: {playerPoints.toLocaleString()}
            </span>
          </div>
          <p className="text-zinc-500 text-sm mt-2">
            Выигранный матч = 10 баллов • Проигранный матч = 0 баллов
          </p>
        </div>

        <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-6">
          {skins.map((skin) => {
            const canAfford = playerPoints >= skin.price;

            return (
              <Card
                key={skin.id}
                className={`bg-zinc-900/50 border-zinc-800 hover:border-yellow-500 transition-all duration-300 ${
                  !canAfford ? "opacity-60" : ""
                }`}
              >
                <CardHeader className="text-center pb-3">
                  <div className="text-6xl mb-2">{skin.image}</div>
                  <Badge
                    variant="outline"
                    className={`w-fit mx-auto mb-2 ${rarityColors[skin.rarity]}`}
                  >
                    {rarityLabels[skin.rarity]}
                  </Badge>
                  <CardTitle className="text-lg font-bold text-white">
                    {skin.name}
                  </CardTitle>
                  <CardDescription className="text-zinc-400 text-sm">
                    {skin.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="pt-0">
                  <div className="text-center mb-4">
                    <div className="flex items-center justify-center space-x-1">
                      <Icon
                        name="Coins"
                        size={16}
                        className="text-yellow-400"
                      />
                      <span className="text-xl font-bold text-white">
                        {skin.price}
                      </span>
                    </div>
                  </div>

                  <Button
                    className={`w-full ${
                      canAfford
                        ? "bg-gradient-to-r from-yellow-400 to-yellow-600 text-black hover:from-yellow-500 hover:to-yellow-700"
                        : "bg-zinc-700 text-zinc-400 cursor-not-allowed"
                    }`}
                    disabled={!canAfford}
                  >
                    {canAfford ? (
                      <>
                        <Icon name="ShoppingBag" size={16} className="mr-2" />
                        Купить
                      </>
                    ) : (
                      <>
                        <Icon name="Lock" size={16} className="mr-2" />
                        Недостаточно баллов
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>
    </div>
  );
}
