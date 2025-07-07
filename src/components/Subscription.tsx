import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Icon from "@/components/ui/icon";

const subscriptionFeatures = [
  "Участие в турнирах",
  "Честный подбор по рейтингу",
  "Региональные рейтинги",
  "Призовой фонд от подписок",
];

const freeFeatures = [
  { name: "Обычные матчи", available: true },
  { name: "Рейтинговая система", available: true },
  { name: "Статистика игр", available: true },
  { name: "Турниры", available: false },
];

export default function Subscription() {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h3 className="text-3xl font-bold mb-6">Подписка за 150₽</h3>
            <p className="text-zinc-400 mb-8 text-lg">
              Получите доступ к турнирам, честному подбору игроков и возможности
              выиграть призы
            </p>

            <div className="space-y-4 mb-8">
              {subscriptionFeatures.map((feature, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full"></div>
                  <span className="text-zinc-300">{feature}</span>
                </div>
              ))}
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
                  {freeFeatures.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <Icon
                        name={feature.available ? "Check" : "X"}
                        size={16}
                        className={
                          feature.available ? "text-green-400" : "text-red-400"
                        }
                      />
                      <span
                        className={
                          feature.available ? "text-zinc-300" : "text-zinc-500"
                        }
                      >
                        {feature.name}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
