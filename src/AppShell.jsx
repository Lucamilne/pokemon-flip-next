import { useLocation } from 'react-router-dom';
import { useGameContext } from '@/contexts/GameContext';

export default function AppShell({ children }) {
  const { isPlayerVictory } = useGameContext();
  const location = useLocation();
  const pathname = location.pathname;

  const getBackgroundClass = () => {
    if (isPlayerVictory && pathname.endsWith('/result')) {
      return 'bg-pokedex-blue';
    }
    if (isPlayerVictory === false && pathname.endsWith('/result')) {
      return 'bg-pokedex-red';
    }
    if (isPlayerVictory === null && pathname.endsWith('/result')) {
      return 'bg-neutral-100';
    }
    if (pathname.endsWith('/select')) {
      return 'bg-pokedex-light-blue';
    }
    if (pathname.endsWith('/play')) {
      return 'bg-pokedex-red';
    }
    
    if (pathname === '/') return 'bg-neutral-100';

    return 'bg-(--color-psychic-300)';
  };

  return (
    <div
      className={`text-black transition-all duration-800 ease-in-out ${getBackgroundClass()} bg-linear-to-r from-black/30 via-transparent to-black/30`}
    >
      <main className="flex justify-center h-dvh md:h-screen font-sans md:p-4 relative">
        <div className="md:h-[calc(100vh-32px)] w-full max-w-5xl">
          {children}
        </div>
      </main>
    </div>
  );
}
