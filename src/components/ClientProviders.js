'use client';

// import { AuthProvider } from '@/contexts/AuthContext';
import { GameProvider } from '@/contexts/GameContext';

export default function ClientProviders({ children }) {
  // return <AuthProvider>{children}</AuthProvider>;
  return <GameProvider>{children}</GameProvider>;
}
