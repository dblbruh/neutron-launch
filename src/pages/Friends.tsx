import { useState, useEffect, useRef } from "react";
import { useSearchParams, Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import Icon from "@/components/ui/icon";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import funcUrls from "../../backend/func2url.json";

interface Friend {
  id: number;
  username: string;
  displayName: string;
  points: number;
  level: number;
  status: string;
}

interface Message {
  id: number;
  sender_id: number;
  receiver_id: number;
  message: string;
  created_at: string;
  sender_username: string;
  receiver_username: string;
}

export default function Friends() {
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();
  const [friends, setFriends] = useState<Friend[]>([]);
  const [selectedFriend, setSelectedFriend] = useState<Friend | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isAuthenticated || !user) return;

    loadFriends();
    
    const chatId = searchParams.get('chat');
    if (chatId) {
      const friendId = parseInt(chatId);
      const friend = friends.find(f => f.id === friendId);
      if (friend) {
        setSelectedFriend(friend);
        loadMessages(friendId);
      }
    }
  }, [isAuthenticated, user]);

  useEffect(() => {
    if (selectedFriend) {
      const interval = setInterval(() => {
        loadMessages(selectedFriend.id);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [selectedFriend]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const loadFriends = async () => {
    if (!user) return;
    
    try {
      const response = await fetch(`${funcUrls.content}?resource=friends&user_id=${user.id}`);
      if (response.ok) {
        const data = await response.json();
        setFriends(data);
      }
    } catch (error) {
      console.error('Failed to load friends:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async (friendId: number) => {
    if (!user) return;
    
    try {
      const response = await fetch(
        `${funcUrls.content}?resource=chat&user_id=${user.id}&friend_id=${friendId}`
      );
      if (response.ok) {
        const data = await response.json();
        setMessages(data);
      }
    } catch (error) {
      console.error('Failed to load messages:', error);
    }
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedFriend || !user) return;

    try {
      const response = await fetch(`${funcUrls.content}?resource=chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sender_id: user.id,
          receiver_id: selectedFriend.id,
          message: newMessage.trim()
        })
      });

      if (response.ok) {
        setNewMessage("");
        loadMessages(selectedFriend.id);
      } else {
        toast({
          title: "Ошибка",
          description: "Не удалось отправить сообщение",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Ошибка сети",
        description: "Не удалось отправить сообщение",
        variant: "destructive"
      });
    }
  };

  const openChat = (friend: Friend) => {
    setSelectedFriend(friend);
    setSearchParams({ chat: friend.id.toString() });
    loadMessages(friend.id);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-black text-white">
        <Header />
        <main className="container mx-auto px-4 py-8 text-center">
          <p className="text-zinc-400 mb-4">Войдите чтобы просматривать друзей</p>
          <Link to="/login">
            <Button>Войти</Button>
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
          <Card className="bg-zinc-900/50 border-zinc-800 flex flex-col">
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-white">
                <span>Друзья ({friends.length})</span>
                <Button size="sm" variant="outline" className="border-zinc-700">
                  <Icon name="UserPlus" size={16} />
                </Button>
              </CardTitle>
              <Input
                placeholder="Поиск друзей..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-zinc-800/50 border-zinc-700 mt-4"
              />
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto">
              {loading ? (
                <div className="flex justify-center py-8">
                  <Icon name="Loader2" size={32} className="animate-spin text-yellow-400" />
                </div>
              ) : friends.length === 0 ? (
                <div className="text-center py-8 text-zinc-400">
                  <Icon name="Users" size={48} className="mx-auto mb-4 text-zinc-600" />
                  <p>У вас пока нет друзей</p>
                  <p className="text-sm mt-2">Добавьте друзей через поиск пользователей</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {friends
                    .filter(f => 
                      f.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      f.displayName.toLowerCase().includes(searchQuery.toLowerCase())
                    )
                    .map((friend) => (
                      <div
                        key={friend.id}
                        onClick={() => openChat(friend)}
                        className={`p-3 rounded-lg cursor-pointer transition-colors ${
                          selectedFriend?.id === friend.id
                            ? 'bg-yellow-400/10 border border-yellow-600'
                            : 'bg-zinc-800/50 hover:bg-zinc-800 border border-transparent'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <div className="relative">
                            <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center font-bold text-black">
                              {friend.displayName[0].toUpperCase()}
                            </div>
                            <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-zinc-900 ${
                              friend.status === 'online' ? 'bg-green-500' : 'bg-zinc-500'
                            }`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-white truncate">{friend.displayName}</p>
                            <p className="text-xs text-zinc-400 truncate">@{friend.username}</p>
                          </div>
                          <Badge variant="outline" className="border-zinc-700 text-zinc-400">
                            Ур. {friend.level}
                          </Badge>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="lg:col-span-2 bg-zinc-900/50 border-zinc-800 flex flex-col">
            {selectedFriend ? (
              <>
                <CardHeader className="border-b border-zinc-800">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center font-bold text-black">
                        {selectedFriend.displayName[0].toUpperCase()}
                      </div>
                      <div>
                        <h3 className="font-semibold text-white">{selectedFriend.displayName}</h3>
                        <Link to={`/user/${selectedFriend.username}`} className="text-xs text-yellow-400 hover:underline">
                          @{selectedFriend.username}
                        </Link>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="border-zinc-700" asChild>
                      <Link to={`/user/${selectedFriend.username}`}>
                        <Icon name="User" size={16} className="mr-2" />
                        Профиль
                      </Link>
                    </Button>
                  </div>
                </CardHeader>

                <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.length === 0 ? (
                    <div className="flex items-center justify-center h-full text-zinc-400">
                      <div className="text-center">
                        <Icon name="MessageCircle" size={48} className="mx-auto mb-4 text-zinc-600" />
                        <p>Начните переписку</p>
                      </div>
                    </div>
                  ) : (
                    messages.map((msg) => {
                      const isOwn = msg.sender_id === user?.id;
                      return (
                        <div key={msg.id} className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
                          <div className={`max-w-[70%] rounded-lg p-3 ${
                            isOwn 
                              ? 'bg-yellow-400/10 text-white' 
                              : 'bg-zinc-800 text-zinc-100'
                          }`}>
                            <p className="text-sm">{msg.message}</p>
                            <p className="text-xs text-zinc-500 mt-1">
                              {new Date(msg.created_at).toLocaleTimeString('ru-RU', {
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </p>
                          </div>
                        </div>
                      );
                    })
                  )}
                  <div ref={messagesEndRef} />
                </CardContent>

                <div className="p-4 border-t border-zinc-800">
                  <form onSubmit={sendMessage} className="flex space-x-2">
                    <Input
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Введите сообщение..."
                      className="bg-zinc-800/50 border-zinc-700"
                    />
                    <Button 
                      type="submit" 
                      disabled={!newMessage.trim()}
                      className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-black hover:from-yellow-500 hover:to-yellow-700"
                    >
                      <Icon name="Send" size={16} />
                    </Button>
                  </form>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-zinc-400">
                <div className="text-center">
                  <Icon name="MessageCircle" size={64} className="mx-auto mb-4 text-zinc-600" />
                  <p>Выберите друга для начала переписки</p>
                </div>
              </div>
            )}
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}
