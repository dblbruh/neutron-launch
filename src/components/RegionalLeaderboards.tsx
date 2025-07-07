import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Player {
  rank: number;
  name: string;
  rating: number;
  matches: number;
}

const mockPlayers: Player[] = [
  { rank: 1, name: "s1mple_ru", rating: 2847, matches: 156 },
  { rank: 2, name: "electronic_msc", rating: 2734, matches: 143 },
  { rank: 3, name: "sh1ro_legend", rating: 2689, matches: 132 },
  { rank: 4, name: "perfecto_aim", rating: 2567, matches: 128 },
  { rank: 5, name: "boombl4_igl", rating: 2445, matches: 119 },
];

const regions = [
  { id: "moscow", name: "Москва", players: mockPlayers },
  { id: "spb", name: "СПб", players: [] },
  { id: "ekb", name: "Екб", players: [] },
  { id: "nsk", name: "Нск", players: [] },
];

function PlayersList({ players }: { players: Player[] }) {
  if (players.length === 0) {
    return (
      <Card className="bg-zinc-800/50 border-zinc-700">
        <CardContent className="p-6">
          <div className="text-center text-zinc-400">
            <p>Рейтинг игроков региона загружается...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-zinc-800/50 border-zinc-700">
      <CardContent className="p-6">
        <div className="space-y-4">
          {players.map((player) => (
            <div
              key={player.rank}
              className="flex items-center justify-between p-4 bg-zinc-700/30 rounded-lg"
            >
              <div className="flex items-center space-x-4">
                <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center">
                  <span className="text-black font-bold text-sm">
                    {player.rank}
                  </span>
                </div>
                <div>
                  <p className="text-white font-semibold">{player.name}</p>
                  <p className="text-zinc-400 text-sm">
                    {player.matches} матчей
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-white font-bold">{player.rating}</p>
                <p className="text-zinc-400 text-sm">рейтинг</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default function RegionalLeaderboards() {
  return (
    <section className="py-16 bg-zinc-900/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold mb-4">Рейтинги по регионам</h3>
          <p className="text-zinc-400 max-w-2xl mx-auto">
            Следите за лучшими игроками вашего региона и всей России
          </p>
        </div>

        <Tabs defaultValue="moscow" className="w-full">
          <TabsList className="grid grid-cols-4 w-full max-w-md mx-auto mb-8 bg-zinc-800">
            {regions.map((region) => (
              <TabsTrigger
                key={region.id}
                value={region.id}
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-yellow-400 data-[state=active]:to-yellow-600 data-[state=active]:text-black"
              >
                {region.name}
              </TabsTrigger>
            ))}
          </TabsList>

          {regions.map((region) => (
            <TabsContent
              key={region.id}
              value={region.id}
              className="space-y-4"
            >
              <PlayersList players={region.players} />
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  );
}
