export interface Player {
  id: string;
  name: string;
  rating: number;
  rank: string;
  avatar: string;
  winRate: number;
  kd: number;
  wins: number;
  losses: number;
  isYou?: boolean;
}

export interface MatchmakingStep {
  id: string;
  title: string;
  description: string;
  duration: number;
  icon: string;
}

export interface Server {
  name: string;
  ping: number;
  location: string;
}

export interface MatchmakingModalProps {
  isOpen: boolean;
  onClose: () => void;
  gameMode: string;
}

export interface MatchmakingState {
  currentStep: number;
  progress: number;
  players: Player[];
  foundPlayers: number;
  yourTeam: Player[];
  enemyTeam: Player[];
  selectedServer: string;
  isSearching: boolean;
}
