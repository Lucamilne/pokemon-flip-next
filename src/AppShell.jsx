import { useLocation } from 'react-router-dom';

export default function AppShell({ children }) {
  const location = useLocation();
  const pathname = location.pathname;

  const getBackgroundStyle = () => {
    if (pathname.endsWith('/select')) {
      return { backgroundColor: '#59acff' };
    }
    if (pathname.endsWith('/play')) {
      return { backgroundColor: '#e61919' };
    }
    return { backgroundColor: '#ddd' };
  };

  return (
    <div
      className="text-black transition-all duration-400 ease-in-out"
      style={getBackgroundStyle()}
    >
      {/* Mobile splash screen */}
      {/* <div className="block md:hidden min-h-screen flex items-center justify-center p-8">
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
      </div> */}

      {/* Main app - hidden on mobile */}
      <main className="flex justify-center min-h-screen font-sans bg-black/15 lg:p-4">
        <div className="h-screen lg:h-[calc(100vh-32px)] overflow-hidden w-full max-w-5xl">
          {children}
        </div>
      </main>
    </div>
  );
}
