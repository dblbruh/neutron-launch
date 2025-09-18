import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Icon from "@/components/ui/icon";
import { useAuth } from "@/hooks/useAuth";
import { useRealMatchmaking } from "@/hooks/useRealMatchmaking";

interface GameMatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  gameMode: string;
}

export default function GameMatchModal({ isOpen, onClose, gameMode }: GameMatchModalProps) {
  const { user } = useAuth();
  const { isSearching, matchFound, searchTime, error, joinQueue, leaveQueue } = useRealMatchmaking(
    isOpen, 
    user?.id, 
    gameMode
  );

  const [gamePhase, setGamePhase] = useState<'lobby' | 'searching' | 'match_found' | 'in_game'>('lobby');

  useEffect(() => {
    if (isSearching) {
      setGamePhase('searching');
    } else if (matchFound) {
      setGamePhase('match_found');
    } else {
      setGamePhase('lobby');
    }
  }, [isSearching, matchFound]);

  const handleStartSearch = () => {
    if (!user) {
      alert("Необходимо войти в аккаунт для поиска игры");
      return;
    }
    joinQueue();
  };

  const handleCancelSearch = () => {
    leaveQueue();
  };

  const handleAcceptMatch = () => {
    setGamePhase('in_game');
    // Здесь будет запуск игры
    setTimeout(() => {
      alert("🎮 Игра завершена! (это демо)");
      onClose();
      setGamePhase('lobby');
    }, 3000);
  };

  const handleDeclineMatch = () => {
    leaveQueue();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const renderLobbyPhase = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-xl font-semibold mb-2">Режим: {gameMode}</h3>
        <p className="text-zinc-400">
          Готовы найти достойного противника?
        </p>
      </div>

      {error && (
        <Alert className="bg-red-900/20 border-red-500/50">
          <Icon name="AlertCircle" size={16} className="text-red-400" />
          <AlertDescription className="text-red-400">{error}</AlertDescription>
        </Alert>
      )}

      <div className="flex justify-center space-x-4">
        <Button 
          onClick={handleStartSearch}
          className="bg-green-600 hover:bg-green-700 px-8"
          disabled={!user}
        >
          <Icon name="Search" size={16} className="mr-2" />
          Найти игру
        </Button>
        <Button 
          onClick={onClose}
          variant="outline"
          className="border-zinc-700 text-zinc-300"
        >
          Отмена
        </Button>
      </div>
    </div>
  );

  const renderSearchingPhase = () => (
    <div className="space-y-6 text-center">
      <div className="space-y-4">
        <div className="w-16 h-16 mx-auto">
          <Icon name="Loader2" size={64} className="text-blue-400 animate-spin" />
        </div>
        <h3 className="text-xl font-semibold">Поиск противника...</h3>
        <p className="text-zinc-400">
          Время поиска: <span className="text-white font-mono">{formatTime(searchTime)}</span>
        </p>
      </div>

      <div className="bg-zinc-800/50 rounded-lg p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-zinc-400">Ваш рейтинг:</span>
          <span className="text-yellow-400 font-semibold">{user?.points || 0}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-zinc-400">Режим игры:</span>
          <span className="text-white">{gameMode}</span>
        </div>
      </div>

      <Button 
        onClick={handleCancelSearch}
        variant="outline"
        className="border-red-500/50 text-red-400 hover:bg-red-900/20"
      >
        <Icon name="X" size={16} className="mr-2" />
        Отменить поиск
      </Button>
    </div>
  );

  const renderMatchFoundPhase = () => (
    <div className="space-y-6 text-center">
      <div className="space-y-4">
        <div className="w-16 h-16 mx-auto">
          <Icon name="CheckCircle" size={64} className="text-green-400" />
        </div>
        <h3 className="text-xl font-semibold text-green-400">Противник найден!</h3>
      </div>

      {matchFound && (
        <div className="bg-zinc-800/50 rounded-lg p-6">
          <div className="flex items-center justify-center space-x-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mb-2 mx-auto">
                {user?.avatar ? (
                  <img src={user.avatar} alt="You" className="w-full h-full rounded-full object-cover" />
                ) : (
                  <Icon name="User" size={24} className="text-white" />
                )}
              </div>
              <p className="font-semibold">{user?.displayName || user?.username}</p>
              <p className="text-sm text-zinc-400">Уровень {user?.level}</p>
            </div>
            
            <div className="text-yellow-400">
              <Icon name="Zap" size={32} />
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mb-2 mx-auto">
                {matchFound.opponent.avatar ? (
                  <img src={matchFound.opponent.avatar} alt="Opponent" className="w-full h-full rounded-full object-cover" />
                ) : (
                  <Icon name="User" size={24} className="text-white" />
                )}
              </div>
              <p className="font-semibold">{matchFound.opponent.displayName}</p>
              <p className="text-sm text-zinc-400">Уровень {matchFound.opponent.level}</p>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-center space-x-4">
        <Button 
          onClick={handleAcceptMatch}
          className="bg-green-600 hover:bg-green-700 px-8"
        >
          <Icon name="Play" size={16} className="mr-2" />
          Принять
        </Button>
        <Button 
          onClick={handleDeclineMatch}
          variant="outline"
          className="border-red-500/50 text-red-400 hover:bg-red-900/20"
        >
          <Icon name="X" size={16} className="mr-2" />
          Отклонить
        </Button>
      </div>
    </div>
  );

  const renderInGamePhase = () => (
    <div className="space-y-6 text-center">
      <div className="space-y-4">
        <div className="w-16 h-16 mx-auto">
          <Icon name="Gamepad2" size={64} className="text-purple-400 animate-pulse" />
        </div>
        <h3 className="text-xl font-semibold">Игра идёт...</h3>
        <p className="text-zinc-400">
          Подключение к игровому серверу
        </p>
      </div>

      <div className="bg-gradient-to-r from-purple-900/20 to-blue-900/20 rounded-lg p-6">
        <div className="flex items-center justify-center space-x-4">
          <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
          <span className="text-green-400 font-semibold">Подключен к серверу</span>
        </div>
      </div>
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-zinc-900 border-zinc-700">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center space-x-2">
            <Icon name="Gamepad2" size={20} />
            <span>Поиск игры</span>
          </DialogTitle>
        </DialogHeader>

        <div className="py-4">
          {gamePhase === 'lobby' && renderLobbyPhase()}
          {gamePhase === 'searching' && renderSearchingPhase()}
          {gamePhase === 'match_found' && renderMatchFoundPhase()}
          {gamePhase === 'in_game' && renderInGamePhase()}
        </div>
      </DialogContent>
    </Dialog>
  );
}