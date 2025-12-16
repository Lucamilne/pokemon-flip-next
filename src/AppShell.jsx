import { useLocation } from 'react-router-dom';
import { useGameContext } from '@/contexts/GameContext';
import GoogleSignInButton from '@/components/Auth/GoogleSignInButton';

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
    if (pathname.endsWith('/select')) {
      return 'bg-pokedex-light-blue';
    }
    if (pathname.endsWith('/play')) {
      return 'bg-pokedex-red';
    }
    return 'bg-neutral-100';
  };

  return (
    <div
      className={`text-black transition-all duration-800 ease-in-out ${getBackgroundClass()} bg-linear-to-r from-black/30 via-transparent to-black/30`}
    >
      {/* Mobile splash screen */}
      <div className="block md:hidden min-h-screen flex items-center justify-center p-8">
        <div className="text-center default-tile border-8 border-black p-2 shadow-lg/30">
          <h1 className="font-press-start bg-theme-red py-4 text-3xl header-text">
            Pokémon Flip
          </h1>
          <p className="font-press-start text-sm leading-relaxed drop-shadow-md mt-2 py-4">
            This game is not available on mobile devices.
            <br /><br />
            Please visit on a tablet or desktop.
          </p>
        </div>
      </div>

      {/* Main app - hidden on mobile */}
      <main className="hidden md:flex justify-center min-h-screen font-sans lg:p-4 relative">
        {import.meta.env.DEV && <GoogleSignInButton />}
        <div className="h-screen lg:h-[calc(100vh-32px)] overflow-hidden w-full max-w-5xl">
          {children}
        </div>
      </main>
    </div>
  );
}
