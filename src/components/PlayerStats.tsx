import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import Icon from "@/components/ui/icon";
import { getUserStats, simulateOnlineActivity } from "@/utils/userStats";

interface PlayerStatsProps {
  className?: string;
}

export default function PlayerStats({ className }: PlayerStatsProps) {
  const [registeredPlayers, setRegisteredPlayers] = useState(0);
  const [onlinePlayers, setOnlinePlayers] = useState(0);

  useEffect(() => {
    const fetchUserStats = async () => {
      try {
        const stats = getUserStats();
        setRegisteredPlayers(stats.registered);
        
        // Симулируем активность онлайн пользователей
        const onlineCount = simulateOnlineActivity();
        setOnlinePlayers(onlineCount);
      } catch (error) {
        console.error('Ошибка получения статистики пользователей:', error);
        setRegisteredPlayers(1);
        setOnlinePlayers(1);
      }
    };

    fetchUserStats();
    
    // Обновляем данные каждые 30 секунд
    const interval = setInterval(fetchUserStats, 30000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`flex gap-4 ${className}`}>
      <Card className="bg-zinc-900/50 border-zinc-800 hover:border-yellow-500/50 transition-colors">
        <CardContent className="p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <Icon name="Users" size={24} className="text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-zinc-400">Всего игроков</p>
              <p className="text-2xl font-bold text-white">
                {registeredPlayers.toLocaleString()}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-zinc-900/50 border-zinc-800 hover:border-green-500/50 transition-colors">
        <CardContent className="p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-500/20 rounded-lg">
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <Icon name="Gamepad2" size={20} className="text-green-400" />
              </div>
            </div>
            <div>
              <p className="text-sm text-zinc-400">Онлайн</p>
              <p className="text-2xl font-bold text-white">
                {onlinePlayers.toLocaleString()}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}