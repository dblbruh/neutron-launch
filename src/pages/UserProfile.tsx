import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Icon from "@/components/ui/icon";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import funcUrls from "../../backend/func2url.json";

interface UserProfile {
  id: number;
  username: string;
  displayName: string;
  points: number;
  level: number;
  wins: number;
  losses: number;
  winRate: number;
  totalMatches: number;
  memberSince: string;
}

export default function UserProfile() {
  const { username } = useParams<{ username: string }>();
  const { user: currentUser, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFriend, setIsFriend] = useState(false);
  const [friendRequestSent, setFriendRequestSent] = useState(false);

  useEffect(() => {
    if (!username) {
      navigate('/');
      return;
    }

    const loadProfile = async () => {
      try {
        const response = await fetch(`${funcUrls.content}?resource=user&username=${username}`);
        
        if (response.ok) {
          const data = await response.json();
          setProfile(data);
          
          // Проверяем статус дружбы
          if (isAuthenticated && currentUser) {
            checkFriendshipStatus(currentUser.id, data.id);
          }
        } else if (response.status === 404) {
          toast({
            title: "Пользователь не найден",
            description: `Пользователь ${username} не существует`,
            variant: "destructive"
          });
          navigate('/');
        }
      } catch (error) {
        toast({
          title: "Ошибка",
          description: "Не удалось загрузить профиль",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [username, navigate, toast, currentUser, isAuthenticated]);

  const checkFriendshipStatus = async (userId: number, friendId: number) => {
    try {
      const response = await fetch(`${funcUrls.content}?resource=friends&user_id=${userId}`);
      if (response.ok) {
        const friends = await response.json();
        const friend = friends.find((f: any) => f.id === friendId);
        setIsFriend(!!friend);
      }
    } catch (error) {
      console.error('Failed to check friendship:', error);
    }
  };

  const handleAddFriend = async () => {
    if (!isAuthenticated || !currentUser || !profile) {
      toast({
        title: "Требуется авторизация",
        description: "Войдите чтобы добавить в друзья",
        variant: "destructive"
      });
      navigate('/login');
      return;
    }

    try {
      const response = await fetch(`${funcUrls.content}?resource=friends`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'add',
          user_id: currentUser.id,
          friend_id: profile.id
        })
      });

      if (response.ok) {
        setFriendRequestSent(true);
        toast({
          title: "Запрос отправлен",
          description: `Запрос в друзья отправлен ${profile.displayName}`
        });
      }
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось отправить запрос",
        variant: "destructive"
      });
    }
  };

  const handleSendMessage = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    navigate(`/friends?chat=${profile?.id}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <Icon name="Loader2" size={48} className="animate-spin text-yellow-400" />
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!profile) {
    return null;
  }

  const isOwnProfile = currentUser?.id === profile.id;

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Card className="bg-zinc-900/50 border-zinc-800 mb-6">
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                <div className="w-24 h-24 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center text-3xl font-bold text-black">
                  {profile.displayName[0].toUpperCase()}
                </div>
                
                <div className="flex-1 text-center md:text-left">
                  <h1 className="text-3xl font-bold mb-2">{profile.displayName}</h1>
                  <p className="text-zinc-400 mb-4">@{profile.username}</p>
                  
                  <div className="flex flex-wrap gap-2 justify-center md:justify-start mb-4">
                    <Badge variant="outline" className="border-yellow-600 text-yellow-400">
                      <Icon name="Trophy" size={14} className="mr-1" />
                      Уровень {profile.level}
                    </Badge>
                    <Badge variant="outline" className="border-zinc-700 text-zinc-300">
                      <Icon name="Coins" size={14} className="mr-1" />
                      {profile.points.toLocaleString()} очков
                    </Badge>
                  </div>

                  {!isOwnProfile && isAuthenticated && (
                    <div className="flex gap-3 justify-center md:justify-start">
                      {!isFriend && !friendRequestSent ? (
                        <Button
                          onClick={handleAddFriend}
                          className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-black hover:from-yellow-500 hover:to-yellow-700"
                        >
                          <Icon name="UserPlus" size={16} className="mr-2" />
                          Добавить в друзья
                        </Button>
                      ) : friendRequestSent ? (
                        <Button disabled variant="outline" className="border-zinc-700">
                          <Icon name="Clock" size={16} className="mr-2" />
                          Запрос отправлен
                        </Button>
                      ) : (
                        <Button disabled variant="outline" className="border-green-600 text-green-400">
                          <Icon name="Check" size={16} className="mr-2" />
                          Уже в друзьях
                        </Button>
                      )}
                      
                      <Button
                        onClick={handleSendMessage}
                        variant="outline"
                        className="border-zinc-700 text-zinc-300 hover:text-white hover:bg-zinc-800"
                      >
                        <Icon name="MessageCircle" size={16} className="mr-2" />
                        Написать
                      </Button>
                    </div>
                  )}

                  {isOwnProfile && (
                    <Link to="/profile">
                      <Button variant="outline" className="border-zinc-700">
                        <Icon name="Settings" size={16} className="mr-2" />
                        Редактировать профиль
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-zinc-900/50 border-zinc-800">
              <CardHeader>
                <CardTitle className="text-lg text-white">Статистика</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-zinc-400">Побед:</span>
                  <span className="text-green-400 font-semibold">{profile.wins}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-zinc-400">Поражений:</span>
                  <span className="text-red-400 font-semibold">{profile.losses}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-zinc-400">Винрейт:</span>
                  <span className="text-yellow-400 font-semibold">{profile.winRate}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-zinc-400">Всего матчей:</span>
                  <span className="text-white font-semibold">{profile.totalMatches}</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-zinc-900/50 border-zinc-800 md:col-span-2">
              <CardHeader>
                <CardTitle className="text-lg text-white">О игроке</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center text-zinc-400">
                    <Icon name="Calendar" size={16} className="mr-2" />
                    Зарегистрирован: {new Date(profile.memberSince).toLocaleDateString('ru-RU', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </div>
                  <div className="flex items-center text-zinc-400">
                    <Icon name="Target" size={16} className="mr-2" />
                    Рейтинг: {profile.points} очков
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
