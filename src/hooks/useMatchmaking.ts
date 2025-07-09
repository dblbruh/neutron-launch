import { useState, useEffect } from "react";
import {
  MATCHMAKING_STEPS,
  SERVERS,
  generateRandomPlayers,
} from "@/data/matchmaking";
import type { MatchmakingState, Player } from "@/types/matchmaking";

export function useMatchmaking(isOpen: boolean) {
  const [state, setState] = useState<MatchmakingState>({
    currentStep: 0,
    progress: 0,
    players: [],
    foundPlayers: 0,
    yourTeam: [],
    enemyTeam: [],
    selectedServer: "",
    isSearching: true,
  });

  const resetState = () => {
    setState({
      currentStep: 0,
      progress: 0,
      players: [],
      foundPlayers: 0,
      yourTeam: [],
      enemyTeam: [],
      selectedServer: "",
      isSearching: true,
    });
  };

  const divideIntoTeams = (players: Player[]) => {
    const you = players.find((p) => p.isYou)!;
    const others = players.filter((p) => !p.isYou);

    const yourTeamPlayers = [you, ...others.slice(0, 4)];
    const enemyTeamPlayers = others.slice(4, 9);

    setState((prev) => ({
      ...prev,
      yourTeam: yourTeamPlayers,
      enemyTeam: enemyTeamPlayers,
    }));
  };

  useEffect(() => {
    if (!isOpen) {
      resetState();
      return;
    }

    const players = generateRandomPlayers();
    setState((prev) => ({ ...prev, players }));

    const timer = setTimeout(() => {
      const step = MATCHMAKING_STEPS[state.currentStep];

      if (step.id === "searching") {
        // Симуляция поиска игроков
        const playerTimer = setInterval(() => {
          setState((prev) => {
            const newFoundPlayers = prev.foundPlayers + 1;
            if (newFoundPlayers >= 10) {
              clearInterval(playerTimer);
              setTimeout(() => {
                setState((prevState) => ({
                  ...prevState,
                  currentStep: 1,
                }));
              }, 500);
              return { ...prev, foundPlayers: 10 };
            }
            return { ...prev, foundPlayers: newFoundPlayers };
          });
        }, 300);
      } else if (step.id === "balancing") {
        divideIntoTeams(players);
      } else if (step.id === "server") {
        setTimeout(() => {
          setState((prev) => ({
            ...prev,
            selectedServer: SERVERS[0].name,
          }));
        }, 1000);
      } else if (step.id === "ready") {
        setTimeout(() => {
          setState((prev) => ({
            ...prev,
            isSearching: false,
          }));
        }, 1000);
      }

      if (state.currentStep < MATCHMAKING_STEPS.length - 1) {
        setTimeout(() => {
          setState((prev) => ({
            ...prev,
            currentStep: prev.currentStep + 1,
          }));
        }, step.duration);
      }

      // Обновление прогресса
      const progressTimer = setInterval(() => {
        setState((prev) => {
          const newProgress = prev.progress + 100 / (step.duration / 100);
          if (newProgress >= 100) {
            clearInterval(progressTimer);
            return { ...prev, progress: 100 };
          }
          return { ...prev, progress: newProgress };
        });
      }, 100);
    }, 500);

    return () => clearTimeout(timer);
  }, [state.currentStep, isOpen]);

  return {
    ...state,
    currentStepData: MATCHMAKING_STEPS[state.currentStep],
    resetState,
  };
}
