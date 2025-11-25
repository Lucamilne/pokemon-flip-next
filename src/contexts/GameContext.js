'use client';

import { createContext, useContext, useState } from 'react';

const GameContext = createContext();

export function GameProvider({ children }) {
  const [selectedPlayerHand, setSelectedPlayerHand] = useState(null);

  return (
    <GameContext.Provider value={{ selectedPlayerHand, setSelectedPlayerHand }}>
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
