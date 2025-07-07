import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";
import PlayerStats from "@/components/PlayerStats";

export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent z-10"></div>
      <img
        src="/img/ac38b80e-19db-43d1-a9f1-6361bf8739ca.jpg"
        alt="Gaming Setup"
        className="absolute inset-0 w-full h-full object-cover opacity-40"
      />
      <div className="relative z-20 container mx-auto px-4 py-24 lg:py-32">
        <div className="max-w-3xl">
          <h2 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight">
            Профессиональные
            <span className="block bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
              CS2 турниры
            </span>
          </h2>
          <p className="text-xl text-zinc-300 mb-8 leading-relaxed">
            Участвуйте в крупнейших турнирах России. Отборочные туры, честный
            подбор игроков, региональные рейтинги и призы от собранных подписок.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 mb-12">
            <Button
              size="lg"
              className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-black hover:from-yellow-500 hover:to-yellow-700 text-lg px-8"
            >
              <Icon name="Play" size={20} className="mr-2" />
              Начать играть
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-zinc-700 text-zinc-300 hover:text-white text-lg px-8"
            >
              <Icon name="Trophy" size={20} className="mr-2" />
              Турниры
            </Button>
          </div>
          <PlayerStats />
        </div>
      </div>
    </section>
  );
}
