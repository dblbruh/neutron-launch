import Header from "@/components/Header";
import Footer from "@/components/Footer";
import RegionalLeaderboards from "@/components/RegionalLeaderboards";

export default function Leaderboard() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Header />

      <main className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl lg:text-6xl font-bold mb-6">
            Таблица лидеров
          </h1>
          <p className="text-xl text-zinc-400 max-w-3xl mx-auto">
            Лучшие команды России по регионам. Отслеживайте свой прогресс и
            сравнивайте результаты
          </p>
        </div>

        <RegionalLeaderboards />
      </main>

      <Footer />
    </div>
  );
}
