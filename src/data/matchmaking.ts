import type { MatchmakingStep, Player, Server } from "@/types/matchmaking";

export const MATCHMAKING_STEPS: MatchmakingStep[] = [
  {
    id: "searching",
    title: "Поиск игроков",
    description: "Ищем игроков с похожим рейтингом...",
    duration: 3000,
    icon: "Search",
  },
  {
    id: "balancing",
    title: "Балансировка команд",
    description: "Создаем сбалансированные команды...",
    duration: 2000,
    icon: "Scale",
  },
  {
    id: "server",
    title: "Подбор сервера",
    description: "Выбираем сервер с минимальным пингом...",
    duration: 2000,
    icon: "Server",
  },
  {
    id: "ready",
    title: "Матч найден!",
    description: "Подготовка к игре...",
    duration: 1000,
    icon: "CheckCircle",
  },
];

export const SERVERS: Server[] = [
  { name: "Москва", ping: 15, location: "🇷🇺" },
  { name: "Санкт-Петербург", ping: 25, location: "🇷🇺" },
  { name: "Екатеринбург", ping: 45, location: "🇷🇺" },
];

const PLAYER_NAMES = [
  "s1mple",
  "ZywOo",
  "sh1ro",
  "electronic",
  "NiKo",
  "device",
  "Ax1Le",
  "nafany",
  "Perfecto",
  "b1t",
];

const RANKS = ["Серебро", "Золото", "Рубин", "Элита"];

export const generateRandomPlayers = (): Player[] => {
  // Создаем вас как первого игрока
  const you: Player = {
    id: "you",
    name: "Вы",
    rating: 2847,
    rank: "Золото",
    avatar: "you",
    winRate: 63.7,
    kd: 1.76,
    wins: 156,
    losses: 89,
    isYou: true,
  };

  // Создаем остальных игроков
  const otherPlayers = Array.from({ length: 9 }, (_, i) => {
    const wins = 50 + Math.floor(Math.random() * 200);
    const losses = 30 + Math.floor(Math.random() * 150);
    const winRate = Math.round((wins / (wins + losses)) * 100 * 10) / 10;

    return {
      id: `player-${i}`,
      name:
        PLAYER_NAMES[Math.floor(Math.random() * PLAYER_NAMES.length)] +
        Math.floor(Math.random() * 1000),
      rating: 2500 + Math.floor(Math.random() * 800),
      rank: RANKS[Math.floor(Math.random() * RANKS.length)],
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${i}`,
      winRate,
      kd: Math.round((0.8 + Math.random() * 1.5) * 100) / 100,
      wins,
      losses,
      isYou: false,
    };
  });

  return [you, ...otherPlayers];
};
