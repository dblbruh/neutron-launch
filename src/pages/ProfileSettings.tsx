import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Icon from "@/components/ui/icon";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useNavigate, Link } from "react-router-dom";
import funcUrls from "../../backend/func2url.json";

export default function ProfileSettings() {
  const { user, isAuthenticated, updateUser } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    displayName: user?.displayName || "",
    showAge: user?.showAge ?? true,
    avatarUrl: user?.avatarUrl || "",
  });

  if (!isAuthenticated || !user) {
    navigate('/login');
    return null;
  }

  const handleSave = async () => {
    setIsLoading(true);

    try {
      const response = await fetch(`${funcUrls.profile}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'update_settings',
          user_id: user.id,
          display_name: formData.displayName,
          show_age: formData.showAge,
          avatar_url: formData.avatarUrl || null,
        })
      });

      if (response.ok) {
        const data = await response.json();
        updateUser({
          ...user,
          displayName: formData.displayName,
          showAge: formData.showAge,
          avatarUrl: formData.avatarUrl,
        });
        
        toast({
          title: "Настройки сохранены",
          description: "Ваш профиль успешно обновлён"
        });
      } else {
        throw new Error('Failed to update');
      }
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось сохранить настройки",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <Link to="/profile" className="inline-flex items-center text-zinc-400 hover:text-white mb-4">
              <Icon name="ArrowLeft" size={16} className="mr-2" />
              Назад в профиль
            </Link>
            <h1 className="text-3xl font-bold mb-2">Настройки профиля</h1>
            <p className="text-zinc-400">Управляйте своим профилем и приватностью</p>
          </div>

          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className="bg-zinc-900 border border-zinc-800">
              <TabsTrigger value="profile" className="data-[state=active]:bg-yellow-400/10">
                <Icon name="User" size={16} className="mr-2" />
                Профиль
              </TabsTrigger>
              <TabsTrigger value="privacy" className="data-[state=active]:bg-yellow-400/10">
                <Icon name="Shield" size={16} className="mr-2" />
                Приватность
              </TabsTrigger>
              <TabsTrigger value="account" className="data-[state=active]:bg-yellow-400/10">
                <Icon name="Settings" size={16} className="mr-2" />
                Аккаунт
              </TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="space-y-6">
              <Card className="bg-zinc-900/50 border-zinc-800">
                <CardHeader>
                  <CardTitle className="text-white">Информация профиля</CardTitle>
                  <CardDescription className="text-zinc-400">
                    Обновите отображаемое имя и аватар
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center space-x-6">
                    <div className="w-24 h-24 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center text-3xl font-bold text-black overflow-hidden">
                      {formData.avatarUrl ? (
                        <img src={formData.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                      ) : (
                        formData.displayName?.[0]?.toUpperCase() || user.username[0].toUpperCase()
                      )}
                    </div>
                    <div className="flex-1">
                      <Label className="text-zinc-300 mb-2 block">Аватар</Label>
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          className="border-zinc-700 hover:border-yellow-500"
                          onClick={() => document.getElementById('avatar-upload')?.click()}
                        >
                          <Icon name="Upload" size={16} className="mr-2" />
                          Загрузить с ПК
                        </Button>
                        <input
                          id="avatar-upload"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onloadend = () => {
                                setFormData({ ...formData, avatarUrl: reader.result as string });
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                        />
                        {formData.avatarUrl && (
                          <Button 
                            variant="outline" 
                            className="border-red-500/50 text-red-400 hover:bg-red-500/10"
                            onClick={() => setFormData({ ...formData, avatarUrl: '' })}
                          >
                            <Icon name="X" size={16} className="mr-2" />
                            Удалить
                          </Button>
                        )}
                      </div>
                      <p className="text-xs text-zinc-500 mt-1">Поддерживаются JPG, PNG, GIF до 5 МБ</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-zinc-300">Имя пользователя</Label>
                    <Input
                      value={user.username}
                      disabled
                      className="bg-zinc-800/50 border-zinc-700 text-zinc-500"
                    />
                    <p className="text-xs text-zinc-500">Нельзя изменить</p>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-zinc-300">Отображаемое имя</Label>
                    <Input
                      value={formData.displayName}
                      onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                      placeholder="Ваше имя"
                      className="bg-zinc-800 border-zinc-700 text-white"
                      maxLength={50}
                    />
                    <p className="text-xs text-zinc-500">Это имя будут видеть другие игроки</p>
                  </div>

                  <div className="p-4 bg-zinc-800/50 rounded-lg border border-zinc-700 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-zinc-400">Email:</span>
                      <span className="text-white">{user.email}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-zinc-400">Регион:</span>
                      <span className="text-white flex items-center">
                        <Icon name="MapPin" size={14} className="mr-1 text-yellow-400" />
                        {user.region}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-zinc-400">Возраст:</span>
                      <span className="text-white">{user.age} лет</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="privacy" className="space-y-6">
              <Card className="bg-zinc-900/50 border-zinc-800">
                <CardHeader>
                  <CardTitle className="text-white">Настройки приватности</CardTitle>
                  <CardDescription className="text-zinc-400">
                    Контролируйте, какую информацию видят другие
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between p-4 bg-zinc-800/50 rounded-lg border border-zinc-700">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <Icon name="Eye" size={16} className="text-zinc-400" />
                        <Label className="text-white font-medium">Показывать возраст в профиле</Label>
                      </div>
                      <p className="text-sm text-zinc-400">
                        Другие пользователи смогут видеть ваш возраст
                      </p>
                    </div>
                    <Switch
                      checked={formData.showAge}
                      onCheckedChange={(checked) => setFormData({ ...formData, showAge: checked })}
                    />
                  </div>

                  <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                    <div className="flex items-start space-x-2">
                      <Icon name="Info" size={16} className="text-blue-400 mt-0.5 flex-shrink-0" />
                      <div className="text-sm text-zinc-300">
                        <p className="font-medium text-blue-400 mb-1">О приватности</p>
                        <ul className="space-y-1 text-xs">
                          <li>• Регион всегда виден (нужен для региональных турниров)</li>
                          <li>• Имя пользователя всегда видно (публичный профиль)</li>
                          <li>• Email никогда не отображается публично</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="account" className="space-y-6">
              <Card className="bg-zinc-900/50 border-zinc-800">
                <CardHeader>
                  <CardTitle className="text-white">Информация об аккаунте</CardTitle>
                  <CardDescription className="text-zinc-400">
                    Данные вашего аккаунта
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-zinc-800/50 rounded-lg border border-zinc-700 space-y-3">
                    <div className="flex justify-between">
                      <span className="text-zinc-400">ID игрока:</span>
                      <span className="text-white font-mono">#{user.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-400">Уровень:</span>
                      <span className="text-yellow-400 font-semibold">Уровень {user.level}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-400">Очки:</span>
                      <span className="text-yellow-400 font-semibold">{user.points.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-400">Статус:</span>
                      <span className="text-green-400">Активный</span>
                    </div>
                  </div>

                  <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                    <div className="flex items-start space-x-2">
                      <Icon name="AlertTriangle" size={16} className="text-yellow-400 mt-0.5 flex-shrink-0" />
                      <div className="text-sm text-zinc-300">
                        <p className="font-medium text-yellow-400 mb-1">Важно</p>
                        <p className="text-xs">Регион проживания нельзя изменить после регистрации. Если вы переехали, обратитесь в поддержку.</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end gap-3 mt-6">
            <Button
              variant="outline"
              onClick={() => navigate('/profile')}
              className="border-zinc-700"
            >
              Отмена
            </Button>
            <Button
              onClick={handleSave}
              disabled={isLoading}
              className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-black hover:from-yellow-500 hover:to-yellow-700"
            >
              {isLoading ? (
                <>
                  <Icon name="Loader2" size={16} className="mr-2 animate-spin" />
                  Сохранение...
                </>
              ) : (
                <>
                  <Icon name="Check" size={16} className="mr-2" />
                  Сохранить изменения
                </>
              )}
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}