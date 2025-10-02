import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Icon from "@/components/ui/icon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import funcUrls from "../../backend/func2url.json";

interface User {
  id: number;
  username: string;
  displayName: string;
  email: string;
  points: number;
  level: number;
  is_active: boolean;
  is_admin: boolean;
  created_at: string;
}

interface Tournament {
  id: number;
  name: string;
  prize_pool: number;
  status: string;
  start_date: string;
  registered_teams: number;
  max_participants: number;
}

interface Challenge {
  id: number;
  creator: { username: string; displayName: string };
  game_mode: string;
  stake: number;
  status: string;
  created_at: string;
}

interface NewsItem {
  id: number;
  title: string;
  category: string;
  content: string;
  created_at: string;
  author: { username: string };
}

export default function Admin() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    if (!isAuthenticated || !user?.isAdmin) {
      toast({
        title: "Доступ запрещен",
        description: "У вас нет прав администратора",
        variant: "destructive",
      });
      navigate("/");
    }
  }, [isAuthenticated, user, navigate, toast]);

  if (!user?.isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <Icon name="Shield" size={32} className="text-yellow-400" />
                <h1 className="text-4xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
                  Панель администратора
                </h1>
              </div>
              <p className="text-zinc-400">Полное управление платформой</p>
            </div>
            <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/50 px-4 py-2 text-sm">
              <Icon name="Crown" size={16} className="mr-2" />
              Администратор
            </Badge>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-zinc-900 border-zinc-800 grid grid-cols-7 w-full">
            <TabsTrigger value="overview" className="data-[state=active]:bg-yellow-400/10 data-[state=active]:text-yellow-400">
              <Icon name="LayoutDashboard" size={16} className="mr-2" />
              Обзор
            </TabsTrigger>
            <TabsTrigger value="users" className="data-[state=active]:bg-yellow-400/10 data-[state=active]:text-yellow-400">
              <Icon name="Users" size={16} className="mr-2" />
              Игроки
            </TabsTrigger>
            <TabsTrigger value="tournaments" className="data-[state=active]:bg-yellow-400/10 data-[state=active]:text-yellow-400">
              <Icon name="Trophy" size={16} className="mr-2" />
              Турниры
            </TabsTrigger>
            <TabsTrigger value="challenges" className="data-[state=active]:bg-yellow-400/10 data-[state=active]:text-yellow-400">
              <Icon name="Swords" size={16} className="mr-2" />
              Вызовы
            </TabsTrigger>
            <TabsTrigger value="news" className="data-[state=active]:bg-yellow-400/10 data-[state=active]:text-yellow-400">
              <Icon name="Newspaper" size={16} className="mr-2" />
              Новости
            </TabsTrigger>
            <TabsTrigger value="stats" className="data-[state=active]:bg-yellow-400/10 data-[state=active]:text-yellow-400">
              <Icon name="BarChart3" size={16} className="mr-2" />
              Статистика
            </TabsTrigger>
            <TabsTrigger value="settings" className="data-[state=active]:bg-yellow-400/10 data-[state=active]:text-yellow-400">
              <Icon name="Settings" size={16} className="mr-2" />
              Настройки
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <OverviewTab />
          </TabsContent>

          <TabsContent value="users">
            <UsersTab />
          </TabsContent>

          <TabsContent value="tournaments">
            <TournamentsTab />
          </TabsContent>

          <TabsContent value="challenges">
            <ChallengesTab />
          </TabsContent>

          <TabsContent value="news">
            <NewsTab />
          </TabsContent>

          <TabsContent value="stats">
            <StatsTab />
          </TabsContent>

          <TabsContent value="settings">
            <SettingsTab />
          </TabsContent>
        </Tabs>
      </main>

      <Footer />
    </div>
  );
}

function OverviewTab() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    onlineUsers: 0,
    activeTournaments: 0,
    totalPrizePool: 0,
    activeChallenges: 0,
    completedMatches: 0
  });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const response = await fetch(`${funcUrls.content}?resource=stats`);
      if (response.ok) {
        const data = await response.json();
        setStats({
          totalUsers: data.totalUsers || 0,
          onlineUsers: data.onlineUsers || 0,
          activeTournaments: 0,
          totalPrizePool: data.totalPrizePool || 0,
          activeChallenges: 0,
          completedMatches: data.totalTournamentsAndChallenges || 0
        });
      }
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 border-blue-500/30">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-zinc-400">Всего игроков</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold text-white">{stats.totalUsers.toLocaleString()}</div>
              <Icon name="Users" size={32} className="text-blue-400" />
            </div>
            <p className="text-xs text-zinc-500 mt-2">Онлайн: {stats.onlineUsers}</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500/10 to-green-600/10 border-green-500/30">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-zinc-400">Активные турниры</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold text-white">{stats.activeTournaments}</div>
              <Icon name="Trophy" size={32} className="text-green-400" />
            </div>
            <p className="text-xs text-zinc-500 mt-2">Проведено: {stats.completedMatches}</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-500/10 to-yellow-600/10 border-yellow-500/30">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-zinc-400">Призовой фонд</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold text-white">₽{(stats.totalPrizePool / 1000).toFixed(0)}K</div>
              <Icon name="Coins" size={32} className="text-yellow-400" />
            </div>
            <p className="text-xs text-zinc-500 mt-2">Выплачено всего</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500/10 to-purple-600/10 border-purple-500/30">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-zinc-400">Активные вызовы</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold text-white">{stats.activeChallenges}</div>
              <Icon name="Swords" size={32} className="text-purple-400" />
            </div>
            <p className="text-xs text-zinc-500 mt-2">Открытые вызовы</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-500/10 to-red-600/10 border-red-500/30">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-zinc-400">Завершено матчей</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold text-white">{stats.completedMatches}</div>
              <Icon name="Gamepad2" size={32} className="text-red-400" />
            </div>
            <p className="text-xs text-zinc-500 mt-2">За все время</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-500/10 to-orange-600/10 border-orange-500/30">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-zinc-400">Система</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold text-green-400">OK</div>
              <Icon name="Activity" size={32} className="text-orange-400" />
            </div>
            <p className="text-xs text-zinc-500 mt-2">Все системы работают</p>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-zinc-900/50 border-zinc-800">
        <CardHeader>
          <CardTitle className="text-white">Быстрые действия</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button className="h-20 flex-col bg-yellow-500/10 border border-yellow-500/30 hover:bg-yellow-500/20">
              <Icon name="Plus" size={24} className="mb-2 text-yellow-400" />
              <span className="text-sm">Создать турнир</span>
            </Button>
            <Button className="h-20 flex-col bg-blue-500/10 border border-blue-500/30 hover:bg-blue-500/20">
              <Icon name="Newspaper" size={24} className="mb-2 text-blue-400" />
              <span className="text-sm">Новость</span>
            </Button>
            <Button className="h-20 flex-col bg-green-500/10 border border-green-500/30 hover:bg-green-500/20">
              <Icon name="Ban" size={24} className="mb-2 text-green-400" />
              <span className="text-sm">Модерация</span>
            </Button>
            <Button className="h-20 flex-col bg-purple-500/10 border border-purple-500/30 hover:bg-purple-500/20">
              <Icon name="Database" size={24} className="mb-2 text-purple-400" />
              <span className="text-sm">База данных</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function UsersTab() {
  const { toast } = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${funcUrls.profile}?action=admin_list_users`);
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      }
    } catch (error) {
      console.error('Failed to load users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBanUser = async (userId: number) => {
    try {
      const response = await fetch(`${funcUrls.profile}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'admin_ban_user',
          user_id: userId
        })
      });

      if (response.ok) {
        toast({ title: "Пользователь заблокирован" });
        loadUsers();
      }
    } catch (error) {
      toast({ title: "Ошибка", variant: "destructive" });
    }
  };

  const handleMakeAdmin = async (userId: number) => {
    try {
      const response = await fetch(`${funcUrls.profile}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'admin_make_admin',
          user_id: userId
        })
      });

      if (response.ok) {
        toast({ title: "Права администратора выданы" });
        loadUsers();
      }
    } catch (error) {
      toast({ title: "Ошибка", variant: "destructive" });
    }
  };

  const filteredUsers = users.filter(u => 
    u.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.displayName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <Card className="bg-zinc-900/50 border-zinc-800">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-white">Управление игроками</CardTitle>
              <CardDescription>Всего игроков: {users.length}</CardDescription>
            </div>
            <Button className="bg-yellow-500/20 border border-yellow-500/30 hover:bg-yellow-500/30">
              <Icon name="Download" size={16} className="mr-2" />
              Экспорт
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Поиск по имени, email..."
                className="bg-zinc-800 border-zinc-700"
              />
            </div>
            <Button variant="outline" className="border-zinc-700">
              <Icon name="Filter" size={16} className="mr-2" />
              Фильтры
            </Button>
          </div>

          <div className="space-y-2 max-h-[600px] overflow-y-auto">
            {loading ? (
              <div className="text-center py-12">
                <Icon name="Loader2" size={48} className="animate-spin mx-auto mb-4 text-yellow-400" />
                <p className="text-zinc-400">Загрузка игроков...</p>
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="text-center py-12">
                <Icon name="Users" size={48} className="mx-auto mb-4 text-zinc-600" />
                <p className="text-zinc-400">Игроки не найдены</p>
              </div>
            ) : (
              filteredUsers.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between p-4 bg-zinc-800/50 rounded-lg border border-zinc-700 hover:border-yellow-500/50 transition-all"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-lg flex items-center justify-center font-bold text-black">
                      {user.username[0].toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-white font-semibold">{user.displayName || user.username}</p>
                        {user.is_admin && (
                          <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/50 text-xs">
                            Admin
                          </Badge>
                        )}
                        {!user.is_active && (
                          <Badge className="bg-red-500/20 text-red-400 border-red-500/50 text-xs">
                            Banned
                          </Badge>
                        )}
                      </div>
                      <p className="text-zinc-500 text-sm">@{user.username} • {user.email}</p>
                      <p className="text-zinc-600 text-xs">ID: {user.id} • Уровень: {user.level} • Очки: {user.points}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-zinc-700"
                      onClick={() => setSelectedUser(user)}
                    >
                      <Icon name="Eye" size={14} />
                    </Button>
                    {!user.is_admin && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-yellow-500/50 text-yellow-400"
                        onClick={() => handleMakeAdmin(user.id)}
                      >
                        <Icon name="Shield" size={14} />
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-red-500/50 text-red-400"
                      onClick={() => handleBanUser(user.id)}
                      disabled={!user.is_active}
                    >
                      <Icon name="Ban" size={14} />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function TournamentsTab() {
  return (
    <div className="space-y-6">
      <Card className="bg-zinc-900/50 border-zinc-800">
        <CardHeader>
          <CardTitle className="flex items-center text-white">
            <Icon name="Plus" size={20} className="mr-2" />
            Создать новый турнир
          </CardTitle>
          <CardDescription>Заполните информацию о турнире</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <TournamentForm />
        </CardContent>
      </Card>

      <Card className="bg-zinc-900/50 border-zinc-800">
        <CardHeader>
          <CardTitle className="text-white">Активные турниры</CardTitle>
          <CardDescription>Управление существующими турнирами</CardDescription>
        </CardHeader>
        <CardContent>
          <TournamentList />
        </CardContent>
      </Card>
    </div>
  );
}

function ChallengesTab() {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadChallenges();
  }, []);

  const loadChallenges = async () => {
    try {
      const response = await fetch(`${funcUrls.content}?resource=challenges`);
      if (response.ok) {
        const data = await response.json();
        setChallenges(data);
      }
    } catch (error) {
      console.error('Failed to load challenges:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="bg-zinc-900/50 border-zinc-800">
      <CardHeader>
        <CardTitle className="text-white">Все вызовы</CardTitle>
        <CardDescription>Модерация и управление вызовами</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {loading ? (
            <div className="text-center py-12">
              <Icon name="Loader2" size={48} className="animate-spin mx-auto mb-4 text-yellow-400" />
            </div>
          ) : challenges.length === 0 ? (
            <div className="text-center py-12">
              <Icon name="Swords" size={48} className="mx-auto mb-4 text-zinc-600" />
              <p className="text-zinc-400">Нет активных вызовов</p>
            </div>
          ) : (
            challenges.map((challenge) => (
              <div
                key={challenge.id}
                className="flex items-center justify-between p-4 bg-zinc-800/50 rounded-lg border border-zinc-700"
              >
                <div>
                  <p className="text-white font-semibold">{challenge.creator.displayName}</p>
                  <p className="text-zinc-400 text-sm">
                    {challenge.game_mode} • Ставка: ₽{challenge.stake} • {challenge.status}
                  </p>
                </div>
                <Button size="sm" variant="outline" className="border-red-500/50 text-red-400">
                  <Icon name="X" size={14} className="mr-2" />
                  Отменить
                </Button>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function NewsTab() {
  const [newsList, setNewsList] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNews();
  }, []);

  const loadNews = async () => {
    try {
      const response = await fetch(`${funcUrls.content}?resource=news`);
      if (response.ok) {
        const data = await response.json();
        setNewsList(data);
      }
    } catch (error) {
      console.error('Failed to load news:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-zinc-900/50 border-zinc-800">
        <CardHeader>
          <CardTitle className="flex items-center text-white">
            <Icon name="Plus" size={20} className="mr-2" />
            Создать новость
          </CardTitle>
          <CardDescription>Опубликуйте новость для пользователей</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <NewsForm onSuccess={loadNews} />
        </CardContent>
      </Card>

      <Card className="bg-zinc-900/50 border-zinc-800">
        <CardHeader>
          <CardTitle className="text-white">Опубликованные новости</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {loading ? (
              <div className="text-center py-12">
                <Icon name="Loader2" size={48} className="animate-spin mx-auto mb-4 text-yellow-400" />
              </div>
            ) : newsList.length === 0 ? (
              <div className="text-center py-12">
                <Icon name="Newspaper" size={48} className="mx-auto mb-4 text-zinc-600" />
                <p className="text-zinc-400">Нет опубликованных новостей</p>
              </div>
            ) : (
              newsList.map((news) => (
                <div
                  key={news.id}
                  className="flex items-start justify-between p-4 bg-zinc-800/50 rounded-lg border border-zinc-700"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-white font-semibold">{news.title}</h3>
                      <Badge className="bg-blue-500/20 text-blue-400 text-xs">{news.category}</Badge>
                    </div>
                    <p className="text-zinc-400 text-sm line-clamp-2">{news.content}</p>
                    <p className="text-zinc-600 text-xs mt-2">
                      {news.author.username} • {new Date(news.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="border-zinc-700">
                      <Icon name="Pencil" size={14} />
                    </Button>
                    <Button size="sm" variant="outline" className="border-red-500/50 text-red-400">
                      <Icon name="Trash2" size={14} />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function StatsTab() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-zinc-900/50 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-white">Активность игроков</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center">
              <p className="text-zinc-500">График активности</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900/50 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-white">Регистрации</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center">
              <p className="text-zinc-500">График регистраций</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900/50 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-white">Финансовая статистика</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between p-3 bg-zinc-800/50 rounded">
                <span className="text-zinc-400">Общий оборот</span>
                <span className="text-white font-semibold">₽0</span>
              </div>
              <div className="flex justify-between p-3 bg-zinc-800/50 rounded">
                <span className="text-zinc-400">Комиссия платформы</span>
                <span className="text-white font-semibold">₽0</span>
              </div>
              <div className="flex justify-between p-3 bg-zinc-800/50 rounded">
                <span className="text-zinc-400">Выплачено призов</span>
                <span className="text-white font-semibold">₽0</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900/50 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-white">Популярные режимы</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-zinc-400">1v1 Вызовы</span>
                <span className="text-white font-semibold">0%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-zinc-400">Турниры 5v5</span>
                <span className="text-white font-semibold">0%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-zinc-400">Лобби</span>
                <span className="text-white font-semibold">0%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function SettingsTab() {
  const { toast } = useToast();
  const [settings, setSettings] = useState({
    maintenanceMode: false,
    registrationEnabled: true,
    chatEnabled: true,
    minBetAmount: 10,
    maxBetAmount: 10000,
    platformFee: 10
  });

  const handleSave = () => {
    toast({ title: "Настройки сохранены" });
  };

  return (
    <div className="space-y-6">
      <Card className="bg-zinc-900/50 border-zinc-800">
        <CardHeader>
          <CardTitle className="text-white">Общие настройки</CardTitle>
          <CardDescription>Управление основными параметрами платформы</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between p-4 bg-zinc-800/50 rounded-lg">
            <div>
              <Label className="text-white font-medium">Режим обслуживания</Label>
              <p className="text-sm text-zinc-400">Отключить доступ к сайту для всех пользователей</p>
            </div>
            <Switch
              checked={settings.maintenanceMode}
              onCheckedChange={(checked) => setSettings({ ...settings, maintenanceMode: checked })}
            />
          </div>

          <div className="flex items-center justify-between p-4 bg-zinc-800/50 rounded-lg">
            <div>
              <Label className="text-white font-medium">Регистрация</Label>
              <p className="text-sm text-zinc-400">Разрешить новым пользователям регистрироваться</p>
            </div>
            <Switch
              checked={settings.registrationEnabled}
              onCheckedChange={(checked) => setSettings({ ...settings, registrationEnabled: checked })}
            />
          </div>

          <div className="flex items-center justify-between p-4 bg-zinc-800/50 rounded-lg">
            <div>
              <Label className="text-white font-medium">Чат</Label>
              <p className="text-sm text-zinc-400">Включить глобальный чат</p>
            </div>
            <Switch
              checked={settings.chatEnabled}
              onCheckedChange={(checked) => setSettings({ ...settings, chatEnabled: checked })}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-zinc-300">Минимальная ставка (₽)</Label>
              <Input
                type="number"
                value={settings.minBetAmount}
                onChange={(e) => setSettings({ ...settings, minBetAmount: parseInt(e.target.value) })}
                className="bg-zinc-800/50 border-zinc-700"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-zinc-300">Максимальная ставка (₽)</Label>
              <Input
                type="number"
                value={settings.maxBetAmount}
                onChange={(e) => setSettings({ ...settings, maxBetAmount: parseInt(e.target.value) })}
                className="bg-zinc-800/50 border-zinc-700"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-zinc-300">Комиссия платформы (%)</Label>
              <Input
                type="number"
                value={settings.platformFee}
                onChange={(e) => setSettings({ ...settings, platformFee: parseInt(e.target.value) })}
                className="bg-zinc-800/50 border-zinc-700"
              />
            </div>
          </div>

          <Button
            onClick={handleSave}
            className="w-full bg-gradient-to-r from-yellow-400 to-yellow-600 text-black hover:from-yellow-500 hover:to-yellow-700"
          >
            <Icon name="Check" size={16} className="mr-2" />
            Сохранить настройки
          </Button>
        </CardContent>
      </Card>

      <Card className="bg-zinc-900/50 border-zinc-800">
        <CardHeader>
          <CardTitle className="text-white">Опасная зона</CardTitle>
          <CardDescription className="text-red-400">Необратимые действия</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button variant="outline" className="w-full border-red-500/50 text-red-400 hover:bg-red-500/10">
            <Icon name="Database" size={16} className="mr-2" />
            Очистить кэш
          </Button>
          <Button variant="outline" className="w-full border-red-500/50 text-red-400 hover:bg-red-500/10">
            <Icon name="RefreshCw" size={16} className="mr-2" />
            Сбросить рейтинги
          </Button>
          <Button variant="outline" className="w-full border-red-500/50 text-red-400 hover:bg-red-500/10">
            <Icon name="Trash2" size={16} className="mr-2" />
            Удалить неактивных пользователей
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

function TournamentForm() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    prize: "",
    startDate: "",
    maxTeams: "",
    format: "single-elimination",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch(`${funcUrls.content}?resource=tournaments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'create',
          name: formData.name,
          prize_pool: parseInt(formData.prize) || 0,
          max_participants: parseInt(formData.maxTeams) || 16,
          start_date: formData.startDate,
          format: formData.format
        })
      });

      if (response.ok) {
        toast({
          title: "Турнир создан!",
          description: `Турнир "${formData.name}" успешно создан`,
        });
        setFormData({ name: "", prize: "", startDate: "", maxTeams: "", format: "single-elimination" });
      } else {
        const error = await response.json();
        toast({
          title: "Ошибка",
          description: error.error || "Не удалось создать турнир",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Ошибка сети",
        description: "Не удалось подключиться к серверу",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name" className="text-zinc-300">Название турнира</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Spring Championship 2024"
            className="bg-zinc-800/50 border-zinc-700"
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="prize" className="text-zinc-300">Призовой фонд (₽)</Label>
          <Input
            id="prize"
            type="number"
            value={formData.prize}
            onChange={(e) => setFormData({ ...formData, prize: e.target.value })}
            placeholder="50000"
            className="bg-zinc-800/50 border-zinc-700"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="startDate" className="text-zinc-300">Дата начала</Label>
          <Input
            id="startDate"
            type="datetime-local"
            value={formData.startDate}
            onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
            className="bg-zinc-800/50 border-zinc-700"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="maxTeams" className="text-zinc-300">Количество команд</Label>
          <Input
            id="maxTeams"
            type="number"
            value={formData.maxTeams}
            onChange={(e) => setFormData({ ...formData, maxTeams: e.target.value })}
            placeholder="16"
            className="bg-zinc-800/50 border-zinc-700"
            required
          />
        </div>
      </div>

      <Button
        type="submit"
        className="w-full bg-gradient-to-r from-yellow-400 to-yellow-600 text-black hover:from-yellow-500 hover:to-yellow-700"
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Icon name="Loader2" size={16} className="mr-2 animate-spin" />
            Создание...
          </>
        ) : (
          <>
            <Icon name="Plus" size={16} className="mr-2" />
            Создать турнир
          </>
        )}
      </Button>
    </form>
  );
}

function TournamentList() {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTournaments();
  }, []);

  const loadTournaments = async () => {
    try {
      const response = await fetch(`${funcUrls.content}?resource=tournaments`);
      if (response.ok) {
        const data = await response.json();
        setTournaments(data);
      }
    } catch (error) {
      console.error('Failed to load tournaments:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <Icon name="Loader2" size={48} className="animate-spin mx-auto mb-4 text-yellow-400" />
      </div>
    );
  }

  if (tournaments.length === 0) {
    return (
      <div className="text-center py-12">
        <Icon name="Trophy" size={48} className="mx-auto mb-4 text-zinc-600" />
        <p className="text-zinc-400">Нет активных турниров</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {tournaments.map((tournament) => (
        <div
          key={tournament.id}
          className="flex items-center justify-between p-4 bg-zinc-800/50 rounded-lg border border-zinc-700"
        >
          <div>
            <h3 className="text-white font-semibold">{tournament.name}</h3>
            <p className="text-zinc-400 text-sm">
              Призовой фонд: ₽{tournament.prize_pool.toLocaleString()} • {tournament.registered_teams}/{tournament.max_participants} команд
            </p>
            <p className="text-zinc-500 text-xs">
              Статус: {tournament.status} • Начало: {new Date(tournament.start_date).toLocaleDateString()}
            </p>
          </div>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" className="border-zinc-700">
              <Icon name="Pencil" size={14} />
            </Button>
            <Button size="sm" variant="outline" className="border-red-500/50 text-red-400">
              <Icon name="Trash2" size={14} />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}

function NewsForm({ onSuccess }: { onSuccess?: () => void }) {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    category: "update",
    content: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch(`${funcUrls.content}?resource=news`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formData.title,
          category: formData.category,
          content: formData.content,
          author_id: user?.id
        })
      });

      if (response.ok) {
        toast({
          title: "Новость опубликована!",
          description: `Новость "${formData.title}" успешно опубликована`,
        });
        setFormData({ title: "", category: "update", content: "" });
        onSuccess?.();
      } else {
        toast({
          title: "Ошибка",
          description: "Не удалось опубликовать новость",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Ошибка сети",
        description: "Не удалось подключиться к серверу",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title" className="text-zinc-300">Заголовок</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="Важное обновление платформы"
          className="bg-zinc-800/50 border-zinc-700"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="category" className="text-zinc-300">Категория</Label>
        <select
          id="category"
          value={formData.category}
          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          className="w-full bg-zinc-800/50 border-zinc-700 rounded-md px-3 py-2 text-white border"
        >
          <option value="update">Обновление</option>
          <option value="tournament">Турнир</option>
          <option value="event">Событие</option>
          <option value="announcement">Объявление</option>
        </select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="content" className="text-zinc-300">Содержание</Label>
        <Textarea
          id="content"
          value={formData.content}
          onChange={(e) => setFormData({ ...formData, content: e.target.value })}
          placeholder="Текст новости..."
          className="bg-zinc-800/50 border-zinc-700 min-h-[200px]"
          required
        />
      </div>

      <Button
        type="submit"
        className="w-full bg-gradient-to-r from-yellow-400 to-yellow-600 text-black hover:from-yellow-500 hover:to-yellow-700"
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Icon name="Loader2" size={16} className="mr-2 animate-spin" />
            Публикация...
          </>
        ) : (
          <>
            <Icon name="Send" size={16} className="mr-2" />
            Опубликовать новость
          </>
        )}
      </Button>
    </form>
  );
}
