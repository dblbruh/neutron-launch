import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Team {
  rank: number;
  name: string;
  logo?: string;
  rating: number;
  matches: number;
  players: string[];
}

const mockTeams: Team[] = [
  {
    rank: 1,
    name: "NaVi Moscow",
    rating: 2847,
    matches: 156,
    players: ["s1mple", "electronic", "perfecto", "b1t", "sdy"],
  },
  {
    rank: 2,
    name: "Gambit Legends",
    rating: 2734,
    matches: 143,
    players: ["sh1ro", "nafany", "Ax1Le", "interz", "Hobbit"],
  },
  {
    rank: 3,
    name: "Spirit Force",
    rating: 2689,
    matches: 132,
    players: ["chopper", "magixx", "donk", "sh1ro", "zont1x"],
  },
  {
    rank: 4,
    name: "Virtus.pro",
    rating: 2567,
    matches: 128,
    players: ["Jame", "FL1T", "n0rb3r7", "fame", "qikert"],
  },
  {
    rank: 5,
    name: "Forze Team",
    rating: 2445,
    matches: 119,
    players: ["shalfey", "Jerry", "zorte", "r3salt", "KENSI"],
  },
];

const regions = [
  { id: "moscow", name: "Москва", teams: mockTeams },
  { id: "spb", name: "СПб", teams: [] },
  { id: "ekb", name: "Екб", teams: [] },
  { id: "nsk", name: "Нск", teams: [] },
  { id: "kazan", name: "Казань", teams: [] },
  { id: "nnovgorod", name: "Н.Новгород", teams: [] },
  { id: "sochi", name: "Сочи", teams: [] },
  { id: "rostov", name: "Ростов", teams: [] },
];

function TeamsList({ teams }: { teams: Team[] }) {
  if (teams.length === 0) {
    return (
      <Card className="bg-zinc-800/50 border-zinc-700">
        <CardContent className="p-6">
          <div className="text-center text-zinc-400">
            <p>Рейтинг команд региона загружается...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-zinc-800/50 border-zinc-700">
      <CardContent className="p-6">
        <div className="space-y-4">
          {teams.map((team) => (
            <div
              key={team.rank}
              className="flex items-center justify-between p-4 bg-zinc-700/30 rounded-lg"
            >
              <div className="flex items-center space-x-4">
                <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center">
                  <span className="text-black font-bold text-sm">
                    {team.rank}
                  </span>
                </div>
                <div>
                  <p className="text-white font-semibold">{team.name}</p>
                  <p className="text-zinc-400 text-sm">
                    {team.matches} матчей • {team.players.join(", ")}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-white font-bold">{team.rating}</p>
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
          <h3 className="text-3xl font-bold mb-4">
            Рейтинги команд по регионам
          </h3>
          <p className="text-zinc-400 max-w-2xl mx-auto">
            Лучшие команды каждого региона отбираются на турниры
          </p>
        </div>

        <Tabs defaultValue="moscow" className="w-full">
          <TabsList className="grid grid-cols-4 lg:grid-cols-8 w-full max-w-4xl mx-auto mb-8 bg-zinc-800">
            {regions.map((region) => (
              <TabsTrigger
                key={region.id}
                value={region.id}
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-yellow-400 data-[state=active]:to-yellow-600 data-[state=active]:text-black text-xs"
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
              <TeamsList teams={region.teams} />
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  );
}
