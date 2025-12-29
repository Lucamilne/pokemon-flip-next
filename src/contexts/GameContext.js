'use client';

import { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { GAME_MODES } from '@/constants';
import { saveGameStateToLocalStorage, clearLocalStorage } from '@/utils/gameStorage';

// Re-export for convenience
export { GAME_MODES };

const GameContext = createContext();

export function GameProvider({ children }) {
  const [selectedPlayerHand, setSelectedPlayerHand] = useState(null);
  const [selectedGameMode, setSelectedGameMode] = useState(null);
  const [matchCards, setMatchCards] = useState([]);
  const [isPlayerVictory, setIsPlayerVictory] = useState(null); // null = tie, true = victory, false = defeat
  const [isPlayerTurn, setIsPlayerTurn] = useState(null); // null = not started, true = player's turn, false = CPU's turn
  const [playerHand, setPlayerHand] = useState([]);
  const [cpuHand, setCpuHand] = useState([]);
  const [lastSelectedHand, setLastSelectedHand] = useState([]);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 767px)');

    setIsMobile(mediaQuery.matches);

    const handler = (e) => setIsMobile(e.matches);
    mediaQuery.addEventListener('change', handler);

    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  const [cells, setCells] = useState({
    A1: {
      pokemonCard: null,
      element: null,
      adjacentCells: [null, null, "A2", "B1"],
    },
    A2: {
      pokemonCard: null,
      element: null,
      adjacentCells: ["A1", null, "A3", "B2"],
    },
    A3: {
      pokemonCard: null,
      element: null,
      adjacentCells: ["A2", null, null, "B3"],
    },
    B1: {
      pokemonCard: null,
      element: null,
      adjacentCells: [null, "A1", "B2", "C1"],
    },
    B2: {
      pokemonCard: null,
      element: null,
      adjacentCells: ["B1", "A2", "B3", "C2"],
    },
    B3: {
      pokemonCard: null,
      element: null,
      adjacentCells: ["B2", "A3", null, "C3"],
    },
    C1: {
      pokemonCard: null,
      element: null,
      adjacentCells: [null, "B1", "C2", null],
    },
    C2: {
      pokemonCard: null,
      element: null,
      adjacentCells: ["C1", "B2", "C3", null],
    },
    C3: {
      pokemonCard: null,
      element: null,
      adjacentCells: ["C2", "B3", null, null],
    },
  });

  const score = useMemo(() => {
    let count = 0;
    for (const key in cells) {
      if (cells[key].pokemonCard?.isPlayerCard) count++;
    }
    count += playerHand.filter(card => card !== null).length;
    return count;
  }, [cells, playerHand]);

  // Auto-save game state to localStorage whenever it changes
  useEffect(() => {
    const gameHasStarted =
      Object.values(cells).some(cell => cell.pokemonCard !== null) ||
      playerHand.length > 0 ||
      cpuHand.length > 0;

    if (gameHasStarted) {
      saveGameStateToLocalStorage({
        cells,
        playerHand,
        cpuHand,
        isPlayerTurn
      });
    }
  }, [isPlayerTurn, cells]);

  // Reset game state when starting a new game
  const resetGameState = () => {
    clearLocalStorage();
    setMatchCards([]);
    setIsPlayerVictory(null);
    setIsPlayerTurn(null);
    setPlayerHand([]);
    setCpuHand([]);
    setCells({
      A1: {
        pokemonCard: null,
        element: null,
        adjacentCells: [null, null, "A2", "B1"],
      },
      A2: {
        pokemonCard: null,
        element: null,
        adjacentCells: ["A1", null, "A3", "B2"],
      },
      A3: {
        pokemonCard: null,
        element: null,
        adjacentCells: ["A2", null, null, "B3"],
      },
      B1: {
        pokemonCard: null,
        element: null,
        adjacentCells: [null, "A1", "B2", "C1"],
      },
      B2: {
        pokemonCard: null,
        element: null,
        adjacentCells: ["B1", "A2", "B3", "C2"],
      },
      B3: {
        pokemonCard: null,
        element: null,
        adjacentCells: ["B2", "A3", null, "C3"],
      },
      C1: {
        pokemonCard: null,
        element: null,
        adjacentCells: [null, "B1", "C2", null],
      },
      C2: {
        pokemonCard: null,
        element: null,
        adjacentCells: ["C1", "B2", "C3", null],
      },
      C3: {
        pokemonCard: null,
        element: null,
        adjacentCells: ["C2", "B3", null, null],
      },
    });
  };

  return (
    <GameContext.Provider value={{
      selectedPlayerHand,
      setSelectedPlayerHand,
      selectedGameMode,
      setSelectedGameMode,
      matchCards,
      setMatchCards,
      cells,
      setCells,
      isMobile,
      isPlayerVictory,
      setIsPlayerVictory,
      isPlayerTurn,
      setIsPlayerTurn,
      playerHand,
      setPlayerHand,
      cpuHand,
      setCpuHand,
      lastSelectedHand,
      setLastSelectedHand,
      score,
      resetGameState
    }}>
      {children}
    </GameContext.Provider>
  );
}

export const useGameContext = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGameContext must be used within GameProvider');
  }
  return context;
};
