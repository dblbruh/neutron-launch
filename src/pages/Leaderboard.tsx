import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Icon from "@/components/ui/icon";

interface Player {
  id: number;
  username: string;
  displayName: string;
  points: number;
  level: number;
  wins: number;
  losses: number;
  avatar?: string;
  winRate: number;
}

interface Match {
  id: string;
  gameMode: string;
  player1: string;
  player2: string;
  winner: string;
  score: string;
  duration: string;
  date: string;
}

export default function Leaderboard() {
  const [topPlayers, setTopPlayers] = useState<Player[]>([]);
  const [recentMatches, setRecentMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Симуляция загрузки данных
    const loadData = async () => {
      // В реальном приложении здесь будут API вызовы
      const mockPlayers: Player[] = [
        { id: 1, username: "ProGamer2024", displayName: "Pro Gamer", points: 5847, level: 15, wins: 234, losses: 89, winRate: 72.4 },
        { id: 2, username: "ChampionX", displayName: "Champion X", points: 5241, level: 14, wins: 198, losses: 67, winRate: 74.7 },
        { id: 3, username: "SkillMaster", displayName: "Skill Master", points: 4923, level: 13, wins: 176, losses: 54, winRate: 76.5 },
        { id: 4, username: "ElitePlayer", displayName: "Elite Player", points: 4567, level: 12, wins: 165, losses: 78, winRate: 67.9 },
        { id: 5, username: "GameLord", displayName: "Game Lord", points: 4234, level: 11, wins: 145, losses: 65, winRate: 69.0 },
        { id: 6, username: "MegaWin", displayName: "Mega Win", points: 3987, level: 10, wins: 134, losses: 71, winRate: 65.4 },
        { id: 7, username: "TopShooter", displayName: "Top Shooter", points: 3721, level: 9, wins: 128, losses: 83, winRate: 60.7 },
        { id: 8, username: "UltraGamer", displayName: "Ultra Gamer", points: 3456, level: 8, wins: 119, losses: 91, winRate: 56.7 },
      ];

      const mockMatches: Match[] = [
        { id: "1", gameMode: "Классика", player1: "ProGamer2024", player2: "ChampionX", winner: "ProGamer2024", score: "16-14", duration: "25:34", date: "2 мин назад" },
        { id: "2", gameMode: "Турбо", player1: "SkillMaster", player2: "ElitePlayer", winner: "SkillMaster", score: "16-11", duration: "18:22", date: "8 мин назад" },
        { id: "3", gameMode: "Классика", player1: "GameLord", player2: "MegaWin", winner: "GameLord", score: "16-13", duration: "22:15", date: "15 мин назад" },
        { id: "4", gameMode: "Арена", player1: "TopShooter", player2: "UltraGamer", winner: "UltraGamer", score: "10-8", duration: "12:45", date: "23 мин назад" },
        { id: "5", gameMode: "Классика", player1: "ChampionX", player2: "SkillMaster", winner: "ChampionX", score: "16-12", duration: "20:33", date: "35 мин назад" },
      ];

      setTopPlayers(mockPlayers);
      setRecentMatches(mockMatches);
      setLoading(false);
    };

    loadData();
  }, []);

  const getRankIcon = (position: number) => {
    if (position === 1) return { icon: "Crown", color: "text-yellow-400" };
    if (position === 2) return { icon: "Medal", color: "text-gray-300" };
    if (position === 3) return { icon: "Award", color: "text-amber-600" };
    return { icon: "User", color: "text-zinc-400" };
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />

      <main className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl lg:text-6xl font-bold mb-6">
            Таблица лидеров
          </h1>
          <p className="text-xl text-zinc-400 max-w-3xl mx-auto">
            Лучшие игроки платформы. Отслеживайте свой прогресс и сравнивайте результаты
          </p>
        </div>

        <Tabs defaultValue="players" className="max-w-6xl mx-auto">
          <TabsList className="grid w-full grid-cols-2 bg-zinc-900 mb-8">
            <TabsTrigger value="players" className="text-zinc-300 data-[state=active]:text-white">
              <Icon name="Users" size={16} className="mr-2" />
              Топ игроки
            </TabsTrigger>
            <TabsTrigger value="matches" className="text-zinc-300 data-[state=active]:text-white">
              <Icon name="Gamepad2" size={16} className="mr-2" />
              Последние матчи
            </TabsTrigger>
          </TabsList>

          <TabsContent value="players">
            <Card className="bg-zinc-900/50 border-zinc-800">
              <CardHeader>
                <CardTitle className="text-2xl text-center">Лучшие игроки</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-8">
                    <Icon name="Loader2" size={32} className="animate-spin mx-auto mb-4" />
                    <p className="text-zinc-400">Загрузка рейтинга...</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {topPlayers.map((player, index) => {
                      const position = index + 1;
                      const rankInfo = getRankIcon(position);
                      
                      return (
                        <div 
                          key={player.id} 
                          className="flex items-center space-x-4 p-4 rounded-lg bg-zinc-800/50 hover:bg-zinc-700/50 transition-colors"
                        >
                          <div className="flex items-center space-x-3 min-w-0 flex-1">
                            <div className={`w-8 h-8 flex items-center justify-center ${position <= 3 ? 'text-2xl' : ''}`}>
                              {position <= 3 ? (
                                <Icon name={rankInfo.icon} size={24} className={rankInfo.color} />
                              ) : (
                                <span className="text-zinc-500 font-bold">#{position}</span>
                              )}
                            </div>
                            
                            <div className="w-12 h-12 bg-zinc-700 rounded-full flex items-center justify-center">
                              {player.avatar ? (
                                <img src={player.avatar} alt={player.displayName} className="w-full h-full rounded-full object-cover" />
                              ) : (
                                <Icon name="User" size={20} className="text-zinc-400" />
                              )}
                            </div>
                            
                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold text-white truncate">{player.displayName}</h3>
                              <p className="text-sm text-zinc-400 truncate">@{player.username}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-6 text-sm">
                            <div className="text-center">
                              <div className="flex items-center space-x-1">
                                <Icon name="Star" size={16} className="text-yellow-400" />
                                <span className="text-yellow-400 font-bold">{player.points.toLocaleString()}</span>
                              </div>
                              <p className="text-zinc-500">очков</p>
                            </div>
                            
                            <div className="text-center">
                              <p className="text-white font-semibold">{player.wins}-{player.losses}</p>
                              <p className="text-zinc-500">В/П</p>
                            </div>
                            
                            <div className="text-center">
                              <p className="text-green-400 font-semibold">{player.winRate}%</p>
                              <p className="text-zinc-500">винрейт</p>
                            </div>
                            
                            <div className="text-center">
                              <div className="flex items-center space-x-1">
                                <Icon name="TrendingUp" size={16} className="text-blue-400" />
                                <span className="text-blue-400 font-bold">{player.level}</span>
                              </div>
                              <p className="text-zinc-500">уровень</p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="matches">
            <Card className="bg-zinc-900/50 border-zinc-800">
              <CardHeader>
                <CardTitle className="text-2xl text-center">Последние матчи</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-8">
                    <Icon name="Loader2" size={32} className="animate-spin mx-auto mb-4" />
                    <p className="text-zinc-400">Загрузка матчей...</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {recentMatches.map((match) => (
                      <div 
                        key={match.id}
                        className="flex items-center justify-between p-4 rounded-lg bg-zinc-800/50"
                      >
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-blue-600/20 rounded-lg flex items-center justify-center">
                            <Icon name="Gamepad2" size={20} className="text-blue-400" />
                          </div>
                          
                          <div>
                            <div className="flex items-center space-x-2 mb-1">
                              <span className="font-semibold text-white">{match.player1}</span>
                              <span className="text-zinc-400">vs</span>
                              <span className="font-semibold text-white">{match.player2}</span>
                            </div>
                            <div className="flex items-center space-x-3 text-sm text-zinc-400">
                              <span>{match.gameMode}</span>
                              <span>•</span>
                              <span>{match.duration}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-4">
                          <div className="text-center">
                            <div className="text-lg font-bold text-white mb-1">{match.score}</div>
                            <div className="text-xs text-green-400">Победил: {match.winner}</div>
                          </div>
                          
                          <div className="text-right text-sm text-zinc-500">
                            {match.date}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      <Footer />
    </div>
  );
}