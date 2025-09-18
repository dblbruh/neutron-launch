import { useState, useEffect, useCallback } from "react";

interface Opponent {
  userId: number;
  username: string;
  displayName: string;
  level: number;
  avatar?: string;
  skillRating: number;
}

interface MatchResult {
  matchId: string;
  opponent: Opponent;
  status: 'match_found';
}

export function useRealMatchmaking(isOpen: boolean, userId?: number, gameMode: string = 'classic') {
  const [isSearching, setIsSearching] = useState(false);
  const [matchFound, setMatchFound] = useState<MatchResult | null>(null);
  const [searchTime, setSearchTime] = useState(0);
  const [error, setError] = useState("");

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isSearching) {
      interval = setInterval(() => {
        setSearchTime(prev => prev + 1);
      }, 1000);
    } else {
      setSearchTime(0);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isSearching]);

  const joinQueue = useCallback(async () => {
    if (!userId) {
      setError("Необходимо войти в аккаунт");
      return;
    }

    setIsSearching(true);
    setError("");
    setMatchFound(null);

    try {
      const response = await fetch("https://functions.poehali.dev/8b7952f0-521d-4a29-b7a8-2704ababaa06", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "join_queue",
          userId: userId,
          gameMode: gameMode,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        
        if (result.status === 'match_found') {
          setMatchFound({
            matchId: result.matchId,
            opponent: result.opponent,
            status: 'match_found'
          });
          setIsSearching(false);
        }
        // Если статус 'searching', продолжаем поиск
      } else {
        const errorData = await response.json();
        setError(errorData.error || "Ошибка поиска противника");
        setIsSearching(false);
      }
    } catch (err) {
      setError("Ошибка подключения к серверу");
      setIsSearching(false);
    }
  }, [userId, gameMode]);

  const leaveQueue = useCallback(async () => {
    if (!userId) return;

    try {
      await fetch("https://functions.poehali.dev/8b7952f0-521d-4a29-b7a8-2704ababaa06", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "leave_queue",
          userId: userId,
        }),
      });
    } catch (err) {
      console.error("Error leaving queue:", err);
    } finally {
      setIsSearching(false);
      setSearchTime(0);
      setMatchFound(null);
    }
  }, [userId]);

  const finishMatch = useCallback(async (matchId: string, winnerId: number, scores: { player1: number, player2: number }) => {
    try {
      const response = await fetch("https://functions.poehali.dev/8b7952f0-521d-4a29-b7a8-2704ababaa06", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "finish_match",
          matchId: matchId,
          winnerId: winnerId,
          player1Score: scores.player1,
          player2Score: scores.player2,
          duration: searchTime,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        return result;
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || "Ошибка завершения матча");
      }
    } catch (err) {
      console.error("Error finishing match:", err);
      throw err;
    }
  }, [searchTime]);

  // Сброс состояния при закрытии модалки
  useEffect(() => {
    if (!isOpen && isSearching) {
      leaveQueue();
    }
  }, [isOpen, isSearching, leaveQueue]);

  return {
    isSearching,
    matchFound,
    searchTime,
    error,
    joinQueue,
    leaveQueue,
    finishMatch,
  };
}