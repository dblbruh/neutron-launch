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

interface SubscriptionTier {
  id: string;
  name: string;
  price: number;
  period: string;
  features: string[];
  popular?: boolean;
}

const subscriptionTiers: SubscriptionTier[] = [
  {
    id: "basic",
    name: "Базовый",
    price: 199,
    period: "месяц",
    features: [
      "Доступ к турнирам",
      "Базовая статистика",
      "Поиск команды",
      "Стандартный рейтинг",
    ],
  },
  {
    id: "premium",
    name: "Премиум",
    price: 399,
    period: "месяц",
    popular: true,
    features: [
      "Все функции Базового",
      "Приоритет в матчах",
      "Расширенная статистика",
      "Эксклюзивные турниры",
      "Персональный тренер",
      "Анализ игры с ИИ",
    ],
  },
  {
    id: "pro",
    name: "Про",
    price: 799,
    period: "месяц",
    features: [
      "Все функции Премиум",
      "Профессиональная лига",
      "Индивидуальные тренировки",
      "Доступ к закрытым турнирам",
      "Менеджер команды",
      "Кастомные настройки",
    ],
  },
];

export default function Subscription() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Header />

      <main className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl lg:text-6xl font-bold mb-6">
            Выберите подписку
          </h1>
          <p className="text-xl text-zinc-400 max-w-3xl mx-auto">
            Получите доступ к эксклюзивным турнирам, расширенной статистике и
            профессиональным тренировкам
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {subscriptionTiers.map((tier) => (
            <Card
              key={tier.id}
              className={`relative bg-zinc-900/50 border-zinc-800 hover:border-yellow-500 transition-all duration-300 ${
                tier.popular ? "border-yellow-500 scale-105" : ""
              }`}
            >
              {tier.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-black px-4 py-1 rounded-full text-sm font-semibold">
                    Популярный
                  </div>
                </div>
              )}

              <CardHeader className="text-center">
                <CardTitle className="text-2xl font-bold text-white mb-2">
                  {tier.name}
                </CardTitle>
                <div className="mb-4">
                  <span className="text-4xl font-bold text-yellow-400">
                    {tier.price}₽
                  </span>
                  <span className="text-zinc-400">/{tier.period}</span>
                </div>
                <CardDescription className="text-zinc-400">
                  {tier.id === "basic" && "Идеально для начинающих"}
                  {tier.id === "premium" &&
                    "Лучший выбор для серьезных игроков"}
                  {tier.id === "pro" && "Для профессионалов"}
                </CardDescription>
              </CardHeader>

              <CardContent>
                <ul className="space-y-3 mb-8">
                  {tier.features.map((feature, index) => (
                    <li key={index} className="flex items-center space-x-3">
                      <Icon
                        name="Check"
                        size={16}
                        className="text-green-400 flex-shrink-0"
                      />
                      <span className="text-zinc-300">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  className={`w-full ${
                    tier.popular
                      ? "bg-gradient-to-r from-yellow-400 to-yellow-600 text-black hover:from-yellow-500 hover:to-yellow-700"
                      : "bg-zinc-800 text-white hover:bg-zinc-700"
                  }`}
                  size="lg"
                >
                  Выбрать план
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-16 text-center">
          <p className="text-zinc-400 mb-4">
            Все подписки включают 7-дневный пробный период
          </p>
          <div className="flex justify-center space-x-8 text-sm text-zinc-500">
            <div className="flex items-center space-x-2">
              <Icon name="Shield" size={16} />
              <span>Безопасные платежи</span>
            </div>
            <div className="flex items-center space-x-2">
              <Icon name="RefreshCw" size={16} />
              <span>Отмена в любое время</span>
            </div>
            <div className="flex items-center space-x-2">
              <Icon name="HeadphonesIcon" size={16} />
              <span>24/7 поддержка</span>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
