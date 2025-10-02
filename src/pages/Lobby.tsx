import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Icon from "@/components/ui/icon";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import funcUrls from "../../backend/func2url.json";

interface Friend {
  id: number;
  username: string;
  displayName: string;
  avatarUrl?: string;
  status: string;
}

interface TeamSlot {
  position: number;
  player: Friend | null;
}

export default function Lobby() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [friends, setFriends] = useState<Friend[]>([]);
  const [teamSlots, setTeamSlots] = useState<TeamSlot[]>([
    { position: 0, player: null },
    { position: 1, player: null },
    { position: 2, player: null },
    { position: 3, player: null },
    { position: 4, player: null },
  ]);
  const [loading, setLoading] = useState(true);
  const [showFriendsList, setShowFriendsList] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null);

  useEffect(() => {
    if (!isAuthenticated || !user) {
      navigate('/login');
      return;
    }

    if (user) {
      const updatedSlots = [...teamSlots];
      updatedSlots[2] = {
        position: 2,
        player: {
          id: user.id,
          username: user.username,
          displayName: user.displayName || user.username,
          status: 'online'
        }
      };
      setTeamSlots(updatedSlots);
    }

    loadFriends();
  }, [user, isAuthenticated, navigate]);

  const loadFriends = async () => {
    if (!user) return;
    
    try {
      const response = await fetch(`${funcUrls.profile}?user_id=${user.id}&resource=friends`);
      if (response.ok) {
        const data = await response.json();
        const acceptedFriends = data.filter((f: any) => f.status === 'accepted');
        setFriends(acceptedFriends);
      }
    } catch (error) {
      console.error('Failed to load friends:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSlotClick = (position: number) => {
    if (position === 2) return;
    
    const slot = teamSlots[position];
    if (slot.player) {
      const updatedSlots = [...teamSlots];
      updatedSlots[position] = { position, player: null };
      setTeamSlots(updatedSlots);
    } else {
      setSelectedSlot(position);
      setShowFriendsList(true);
    }
  };

  const handleInviteFriend = (friend: Friend) => {
    if (selectedSlot === null) return;

    const isAlreadyInTeam = teamSlots.some(slot => slot.player?.id === friend.id);
    if (isAlreadyInTeam) {
      toast({
        title: "Ошибка",
        description: "Этот игрок уже в команде",
        variant: "destructive",
      });
      return;
    }

    const updatedSlots = [...teamSlots];
    updatedSlots[selectedSlot] = { position: selectedSlot, player: friend };
    setTeamSlots(updatedSlots);
    setShowFriendsList(false);
    setSelectedSlot(null);

    toast({
      title: "Приглашение отправлено",
      description: `${friend.displayName} приглашен в команду`,
    });
  };

  const handleStartSearch = () => {
    const teamSize = teamSlots.filter(slot => slot.player !== null).length;
    
    toast({
      title: "Поиск матча...",
      description: `Ищем противников для команды из ${teamSize} игроков`,
    });
  };

  const getAvailableFriends = () => {
    return friends.filter(friend => 
      !teamSlots.some(slot => slot.player?.id === friend.id)
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white">
        <Header />
        <main className="container mx-auto px-4 py-16 flex items-center justify-center">
          <div className="text-center">
            <Icon name="Loader2" size={48} className="animate-spin mx-auto mb-4 text-yellow-400" />
            <p className="text-zinc-400">Загрузка лобби...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl lg:text-5xl font-bold mb-4">Лобби команды</h1>
            <p className="text-xl text-zinc-400">
              Соберите команду и найдите противников
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Card className="bg-zinc-900/50 border-zinc-800 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold text-white flex items-center">
                    <Icon name="Users" size={28} className="mr-3 text-yellow-400" />
                    Состав команды
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-5 gap-4 mb-8">
                    {teamSlots.map((slot) => (
                      <div
                        key={slot.position}
                        onClick={() => handleSlotClick(slot.position)}
                        className={`relative aspect-square rounded-xl border-2 transition-all cursor-pointer ${
                          slot.position === 2
                            ? 'border-yellow-500 bg-gradient-to-br from-yellow-400/20 to-yellow-600/20'
                            : slot.player
                            ? 'border-green-500/50 bg-gradient-to-br from-green-400/10 to-green-600/10 hover:border-green-500'
                            : 'border-zinc-700 bg-zinc-900/50 hover:border-yellow-500/50'
                        }`}
                      >
                        {slot.player ? (
                          <div className="absolute inset-0 flex flex-col items-center justify-center p-2">
                            {slot.player.avatarUrl ? (
                              <img 
                                src={slot.player.avatarUrl} 
                                alt={slot.player.displayName}
                                className="w-16 h-16 rounded-lg object-cover mb-2"
                              />
                            ) : (
                              <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-lg flex items-center justify-center mb-2">
                                <Icon name="User" size={32} className="text-black" />
                              </div>
                            )}
                            <p className="text-xs font-semibold text-white text-center truncate w-full">
                              {slot.player.displayName}
                            </p>
                            {slot.position === 2 && (
                              <Badge className="absolute top-2 right-2 bg-yellow-500/80 text-black text-xs">
                                ВЫ
                              </Badge>
                            )}
                            {slot.position !== 2 && (
                              <Button
                                size="sm"
                                variant="ghost"
                                className="absolute top-1 right-1 h-6 w-6 p-0 hover:bg-red-500/20"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleSlotClick(slot.position);
                                }}
                              >
                                <Icon name="X" size={14} className="text-red-400" />
                              </Button>
                            )}
                          </div>
                        ) : (
                          <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <Icon name="Plus" size={32} className="text-zinc-600 mb-2" />
                            <p className="text-xs text-zinc-500">Пригласить</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-4">
                    <Button
                      onClick={handleStartSearch}
                      disabled={teamSlots.filter(s => s.player).length === 0}
                      className="flex-1 bg-gradient-to-r from-yellow-400 to-yellow-600 text-black hover:from-yellow-500 hover:to-yellow-700 text-lg py-6"
                    >
                      <Icon name="Search" size={24} className="mr-2" />
                      Найти матч ({teamSlots.filter(s => s.player).length}/5)
                    </Button>
                    <Button
                      onClick={() => navigate('/play')}
                      variant="outline"
                      className="border-zinc-700 text-zinc-300 hover:text-white py-6"
                    >
                      <Icon name="ArrowLeft" size={20} className="mr-2" />
                      Назад
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-1">
              <Card className="bg-zinc-900/50 border-zinc-800 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-white flex items-center">
                    <Icon name="UserPlus" size={24} className="mr-2 text-yellow-400" />
                    Друзья
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {showFriendsList && selectedSlot !== null && (
                    <div className="mb-4 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                      <p className="text-sm text-yellow-400 text-center">
                        Выберите игрока для слота {selectedSlot + 1}
                      </p>
                    </div>
                  )}

                  <div className="space-y-3 max-h-[600px] overflow-y-auto">
                    {getAvailableFriends().length === 0 ? (
                      <div className="text-center py-8">
                        <Icon name="Users" size={48} className="mx-auto mb-4 text-zinc-600" />
                        <p className="text-zinc-400 text-sm">
                          {friends.length === 0 ? 'Нет друзей' : 'Все друзья уже в команде'}
                        </p>
                      </div>
                    ) : (
                      getAvailableFriends().map((friend) => (
                        <div
                          key={friend.id}
                          onClick={() => showFriendsList && handleInviteFriend(friend)}
                          className={`flex items-center gap-3 p-3 rounded-lg border transition-all ${
                            showFriendsList
                              ? 'border-zinc-700 bg-zinc-800/50 hover:border-yellow-500 cursor-pointer'
                              : 'border-zinc-800 bg-zinc-900/30'
                          }`}
                        >
                          {friend.avatarUrl ? (
                            <img 
                              src={friend.avatarUrl} 
                              alt={friend.displayName}
                              className="w-10 h-10 rounded-lg object-cover"
                            />
                          ) : (
                            <div className="w-10 h-10 bg-gradient-to-br from-zinc-600 to-zinc-800 rounded-lg flex items-center justify-center">
                              <Icon name="User" size={20} className="text-white" />
                            </div>
                          )}
                          <div className="flex-1">
                            <p className="text-white font-semibold text-sm">
                              {friend.displayName}
                            </p>
                            <p className="text-zinc-500 text-xs">@{friend.username}</p>
                          </div>
                          {showFriendsList && (
                            <Icon name="UserPlus" size={18} className="text-yellow-400" />
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
