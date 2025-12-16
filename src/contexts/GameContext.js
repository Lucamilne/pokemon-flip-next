'use client';

import { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { GAME_MODES } from '@/constants/gameModes';
import { saveGameStateToLocalStorage, clearLocalStorage } from '@/utils/gameStorage';

// Re-export for convenience
export { GAME_MODES };

const GameContext = createContext();

export function GameProvider({ children }) {
  const [selectedPlayerHand, setSelectedPlayerHand] = useState(null);
  const [selectedGameMode, setSelectedGameMode] = useState(null);
  const [matchCards, setMatchCards] = useState([]);
  const [isPlayerVictory, setIsPlayerVictory] = useState(null); // null = tie, true = victory, false = defeat
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [playerHand, setPlayerHand] = useState([]);
  const [cpuHand, setCpuHand] = useState([]);

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

  // Calculate score (cards on board + cards in hand)
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
    // Only save if game has started (at least one card placed or hands are populated)
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
  }, [cells]);

  // Reset game state when starting a new game (keeps selection state)
  // Combines context state reset + localStorage clear
  const resetGameState = () => {
    // Clear localStorage
    clearLocalStorage();

    // Reset context state
    setMatchCards([]);
    setIsPlayerVictory(null);
    setIsPlayerTurn(true);
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
      isPlayerVictory,
      setIsPlayerVictory,
      isPlayerTurn,
      setIsPlayerTurn,
      playerHand,
      setPlayerHand,
      cpuHand,
      setCpuHand,
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
