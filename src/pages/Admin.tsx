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
import { useToast } from "@/hooks/use-toast";

export default function Admin() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("tournaments");

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
          <div className="flex items-center space-x-3 mb-2">
            <Icon name="Shield" size={32} className="text-yellow-400" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
              Панель администратора
            </h1>
          </div>
          <p className="text-zinc-400">Управление турнирами, новостями и контентом сайта</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-zinc-900 border-zinc-800">
            <TabsTrigger value="tournaments" className="data-[state=active]:bg-yellow-400/10 data-[state=active]:text-yellow-400">
              <Icon name="Trophy" size={16} className="mr-2" />
              Турниры
            </TabsTrigger>
            <TabsTrigger value="news" className="data-[state=active]:bg-yellow-400/10 data-[state=active]:text-yellow-400">
              <Icon name="Newspaper" size={16} className="mr-2" />
              Новости
            </TabsTrigger>
            <TabsTrigger value="users" className="data-[state=active]:bg-yellow-400/10 data-[state=active]:text-yellow-400">
              <Icon name="Users" size={16} className="mr-2" />
              Пользователи
            </TabsTrigger>
            <TabsTrigger value="settings" className="data-[state=active]:bg-yellow-400/10 data-[state=active]:text-yellow-400">
              <Icon name="Settings" size={16} className="mr-2" />
              Настройки
            </TabsTrigger>
          </TabsList>

          <TabsContent value="tournaments" className="space-y-6">
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
                <p className="text-zinc-400 text-center py-8">
                  Турниры будут отображаться здесь
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="news" className="space-y-6">
            <Card className="bg-zinc-900/50 border-zinc-800">
              <CardHeader>
                <CardTitle className="flex items-center text-white">
                  <Icon name="Plus" size={20} className="mr-2" />
                  Создать новость
                </CardTitle>
                <CardDescription>Опубликуйте новость для пользователей</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <NewsForm />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <Card className="bg-zinc-900/50 border-zinc-800">
              <CardHeader>
                <CardTitle className="text-white">Управление пользователями</CardTitle>
                <CardDescription>Просмотр и модерация пользователей</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-zinc-400 text-center py-8">
                  Функция в разработке
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card className="bg-zinc-900/50 border-zinc-800">
              <CardHeader>
                <CardTitle className="text-white">Настройки сайта</CardTitle>
                <CardDescription>Общие настройки платформы</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-zinc-400 text-center py-8">
                  Функция в разработке
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      <Footer />
    </div>
  );
}

function TournamentForm() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    prize: "",
    startDate: "",
    maxTeams: "",
    format: "single-elimination",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Турнир создан!",
      description: `Турнир "${formData.name}" успешно создан`,
    });
    setFormData({ name: "", prize: "", startDate: "", maxTeams: "", format: "single-elimination" });
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
          <Label htmlFor="prize" className="text-zinc-300">Призовой фонд</Label>
          <Input
            id="prize"
            value={formData.prize}
            onChange={(e) => setFormData({ ...formData, prize: e.target.value })}
            placeholder="50,000₽"
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
      >
        <Icon name="Plus" size={16} className="mr-2" />
        Создать турнир
      </Button>
    </form>
  );
}

function NewsForm() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    title: "",
    category: "update",
    content: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Новость опубликована!",
      description: `Новость "${formData.title}" успешно опубликована`,
    });
    setFormData({ title: "", category: "update", content: "" });
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
          className="w-full bg-zinc-800/50 border-zinc-700 rounded-md px-3 py-2 text-white"
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
      >
        <Icon name="Send" size={16} className="mr-2" />
        Опубликовать новость
      </Button>
    </form>
  );
}
