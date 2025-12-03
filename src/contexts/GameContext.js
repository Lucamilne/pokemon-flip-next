'use client';

import { createContext, useContext, useState } from 'react';
import { GAME_MODES } from '@/constants/gameModes';

// Re-export for convenience
export { GAME_MODES };

const GameContext = createContext();

export function GameProvider({ children }) {
  const [selectedPlayerHand, setSelectedPlayerHand] = useState(null);
  const [selectedGameMode, setSelectedGameMode] = useState(null);
  const [matchCards, setMatchCards] = useState([]);
  const [isPlayerVictory, setIsPlayerVictory] = useState(null); // null = tie, true = victory, false = defeat

  return (
    <GameContext.Provider value={{
      selectedPlayerHand,
      setSelectedPlayerHand,
      selectedGameMode,
      setSelectedGameMode,
      matchCards,
      setMatchCards,
      isPlayerVictory,
      setIsPlayerVictory
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
