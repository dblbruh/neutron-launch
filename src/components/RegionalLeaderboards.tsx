import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";

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
  { id: "central", name: "Центральный ФО", teams: mockTeams },
  { id: "northwest", name: "Северо-Западный ФО", teams: [] },
  { id: "volga", name: "Приволжский ФО", teams: [] },
  { id: "southern", name: "Южный ФО", teams: [] },
  { id: "north-caucasus", name: "Северо-Кавказский ФО", teams: [] },
  { id: "ural", name: "Уральский ФО", teams: [] },
  { id: "siberian", name: "Сибирский ФО", teams: [] },
  { id: "far-eastern", name: "Дальневосточный ФО", teams: [] },
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
  const [selectedRegion, setSelectedRegion] = useState("central");

  const currentRegion =
    regions.find((r) => r.id === selectedRegion) || regions[0];

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

        <div className="max-w-md mx-auto mb-8">
          <Select value={selectedRegion} onValueChange={setSelectedRegion}>
            <SelectTrigger className="w-full bg-zinc-800 border-zinc-700 text-white">
              <SelectValue placeholder="Выберите регион" />
            </SelectTrigger>
            <SelectContent className="bg-zinc-800 border-zinc-700">
              {regions.map((region) => (
                <SelectItem
                  key={region.id}
                  value={region.id}
                  className="text-white hover:bg-zinc-700 focus:bg-zinc-700"
                >
                  {region.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="max-w-4xl mx-auto">
          <h4 className="text-xl font-semibold mb-6 text-center text-yellow-400">
            {currentRegion.name}
          </h4>
          <TeamsList teams={currentRegion.teams} />
        </div>
      </div>
    </section>
  );
}
