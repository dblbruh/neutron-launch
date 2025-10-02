import Icon from "@/components/ui/icon";
import SkinCard from "./SkinCard";
import { skins } from "./storeData";
import { useAuth } from "@/context/AuthContext";

export default function SkinsSection() {
  const { user } = useAuth();
  const playerPoints = user?.points || 0;

  return (
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
        {skins.map((skin) => (
          <SkinCard key={skin.id} skin={skin} playerPoints={playerPoints} />
        ))}
      </div>
    </section>
  );
}