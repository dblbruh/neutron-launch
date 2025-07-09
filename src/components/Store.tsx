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
  // AK-47 скины
  {
    id: "ak47-redline",
    name: "AK-47 | Redline",
    price: 250,
    description: "Классический красный дизайн с белыми линиями",
    image: "🔴",
    rarity: "rare",
  },
  {
    id: "ak47-fire-serpent",
    name: "AK-47 | Fire Serpent",
    price: 8500,
    description: "Огненный змей - самый иконичный скин",
    image: "🔥",
    rarity: "legendary",
  },
  {
    id: "ak47-hydroponic",
    name: "AK-47 | Hydroponic",
    price: 1200,
    description: "Зелёный лист с ярким дизайном",
    image: "🌿",
    rarity: "epic",
  },
  {
    id: "ak47-bloodsport",
    name: "AK-47 | Bloodsport",
    price: 400,
    description: "Кровавый спорт с редким паттерном",
    image: "🩸",
    rarity: "epic",
  },
  {
    id: "ak47-vulcan",
    name: "AK-47 | Vulcan",
    price: 800,
    description: "Металлический блеск с чёрными вставками",
    image: "⚔️",
    rarity: "epic",
  },

  // M4A4 скины
  {
    id: "m4a4-howl",
    name: "M4A4 | Howl",
    price: 12000,
    description: "Легендарный запрещённый скин",
    image: "🐺",
    rarity: "legendary",
  },
  {
    id: "m4a4-asiimov",
    name: "M4A4 | Asiimov",
    price: 650,
    description: "Бело-оранжевый футуристический дизайн",
    image: "🤖",
    rarity: "epic",
  },
  {
    id: "m4a4-dragon-king",
    name: "M4A4 | Dragon King",
    price: 180,
    description: "Китайский дракон с золотыми деталями",
    image: "🐉",
    rarity: "rare",
  },
  {
    id: "m4a4-neo-noir",
    name: "M4A4 | Neo-Noir",
    price: 320,
    description: "Чёрно-белый стиль ноар",
    image: "🎨",
    rarity: "rare",
  },
  {
    id: "m4a4-bullet-rain",
    name: "M4A4 | Bullet Rain",
    price: 90,
    description: "Камуфляж с пулями и кровью",
    image: "🌧️",
    rarity: "common",
  },

  // AWP скины
  {
    id: "awp-dragon-lore",
    name: "AWP | Dragon Lore",
    price: 15000,
    description: "Легендарный дракон - мечта любого снайпера",
    image: "🐲",
    rarity: "legendary",
  },
  {
    id: "awp-asiimov",
    name: "AWP | Asiimov",
    price: 950,
    description: "Классический бело-оранжевый Asiimov",
    image: "🎯",
    rarity: "epic",
  },
  {
    id: "awp-hyper-beast",
    name: "AWP | Hyper Beast",
    price: 420,
    description: "Яркий монстр в неоновых цветах",
    image: "👾",
    rarity: "epic",
  },
  {
    id: "awp-lightning-strike",
    name: "AWP | Lightning Strike",
    price: 380,
    description: "Молния на чёрном фоне",
    image: "⚡",
    rarity: "rare",
  },
  {
    id: "awp-redline",
    name: "AWP | Redline",
    price: 180,
    description: "Красные линии на чёрном фоне",
    image: "🔴",
    rarity: "rare",
  },

  // Пистолеты
  {
    id: "glock-fade",
    name: "Glock-18 | Fade",
    price: 1800,
    description: "Легендарный градиент в розово-жёлтых тонах",
    image: "🌈",
    rarity: "legendary",
  },
  {
    id: "deagle-blaze",
    name: "Desert Eagle | Blaze",
    price: 3200,
    description: "Огненный дизайн на мощном пистолете",
    image: "🔥",
    rarity: "legendary",
  },
  {
    id: "usp-kill-confirmed",
    name: "USP-S | Kill Confirmed",
    price: 650,
    description: "Чёрно-красный камуфляж с черепами",
    image: "☠️",
    rarity: "epic",
  },
  {
    id: "five-seven-monkey-business",
    name: "Five-SeveN | Monkey Business",
    price: 120,
    description: "Весёлые обезьянки на пистолете",
    image: "🐵",
    rarity: "common",
  },

  // Ножи
  {
    id: "karambit-fade",
    name: "Karambit | Fade",
    price: 18000,
    description: "Легендарный карамбит с градиентом",
    image: "🗡️",
    rarity: "legendary",
  },
  {
    id: "butterfly-crimson-web",
    name: "Butterfly | Crimson Web",
    price: 9500,
    description: "Красная паутина на ноже-бабочке",
    image: "🪷",
    rarity: "legendary",
  },
  {
    id: "m9-doppler",
    name: "M9 Bayonet | Doppler",
    price: 4500,
    description: "Фазовые переливы на классическом ноже",
    image: "🌌",
    rarity: "legendary",
  },
  {
    id: "huntsman-case-hardened",
    name: "Huntsman | Case Hardened",
    price: 850,
    description: "Синие пятна на закалённом металле",
    image: "🔵",
    rarity: "epic",
  },
  {
    id: "flip-ultraviolet",
    name: "Flip Knife | Ultraviolet",
    price: 320,
    description: "Ультрафиолетовый оттенок на флип-ноже",
    image: "🟣",
    rarity: "rare",
  },

  // Пулемёты
  {
    id: "m249-nebula-crusader",
    name: "M249 | Nebula Crusader",
    price: 180,
    description: "Космический крестоносец в туманности",
    image: "🌌",
    rarity: "rare",
  },
  {
    id: "negev-power-loader",
    name: "Negev | Power Loader",
    price: 95,
    description: "Мощный погрузчик в рабочих цветах",
    image: "🛠️",
    rarity: "common",
  },

  // Другие ружья
  {
    id: "p90-asiimov",
    name: "P90 | Asiimov",
    price: 280,
    description: "Футуристический дизайн на пистолете-пулемёте",
    image: "🤖",
    rarity: "rare",
  },
  {
    id: "galil-cerberus",
    name: "Galil AR | Cerberus",
    price: 450,
    description: "Трёхглавый пёс ада на автомате",
    image: "🐕",
    rarity: "epic",
  },
  {
    id: "famas-roll-cage",
    name: "FAMAS | Roll Cage",
    price: 65,
    description: "Металлическая решётка в стиле гонок",
    image: "🏁",
    rarity: "common",
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

        <div className="grid lg:grid-cols-6 md:grid-cols-4 sm:grid-cols-3 gap-4">
          {skins.map((skin) => {
            const canAfford = playerPoints >= skin.price;

            return (
              <Card
                key={skin.id}
                className={`bg-zinc-900/50 border-zinc-800 hover:border-yellow-500 transition-all duration-300 ${
                  !canAfford ? "opacity-60" : ""
                }`}
              >
                <CardHeader className="text-center pb-2 p-3">
                  <div className="text-4xl mb-1">{skin.image}</div>
                  <Badge
                    variant="outline"
                    className={`w-fit mx-auto mb-1 text-xs ${rarityColors[skin.rarity]}`}
                  >
                    {rarityLabels[skin.rarity]}
                  </Badge>
                  <CardTitle className="text-sm font-bold text-white leading-tight">
                    {skin.name}
                  </CardTitle>
                  <CardDescription className="text-zinc-400 text-xs leading-tight">
                    {skin.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="pt-0 p-3">
                  <div className="text-center mb-3">
                    <div className="flex items-center justify-center space-x-1">
                      <Icon
                        name="Coins"
                        size={14}
                        className="text-yellow-400"
                      />
                      <span className="text-lg font-bold text-white">
                        {skin.price}
                      </span>
                    </div>
                  </div>

                  <Button
                    className={`w-full text-xs h-8 ${
                      canAfford
                        ? "bg-gradient-to-r from-yellow-400 to-yellow-600 text-black hover:from-yellow-500 hover:to-yellow-700"
                        : "bg-zinc-700 text-zinc-400 cursor-not-allowed"
                    }`}
                    disabled={!canAfford}
                  >
                    {canAfford ? (
                      <>
                        <Icon name="ShoppingBag" size={14} className="mr-1" />
                        Купить
                      </>
                    ) : (
                      <>
                        <Icon name="Lock" size={14} className="mr-1" />
                        Недостаточно
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
