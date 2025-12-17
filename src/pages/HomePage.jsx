import { useState } from 'react';
import PokeballSplash from "@/components/PokeballSplash/PokeballSplash.js";
import HowToPlay from "@/components/HowToPlay/HowToPlay";
import { GAME_MODES } from '@/constants/gameModes';
import { useGameContext } from '@/contexts/GameContext';

export default function HomePage() {
  const { selectedGameMode, setSelectedGameMode } = useGameContext();
  const [isOpen, setIsOpen] = useState(false);


  return (
    <>
      <section className="overflow-hidden relative h-full flex flex-col gap-4 bg-neutral-400 rounded-xl" >
        <div className="absolute z-10 bottom-8 left-1/2 -translate-x-1/2 font-press-start grid grid-cols-1 gap-2 text-xl">
          <div className="relative group text-center">
            <div className={`arrow absolute -left-4 top-0 -translate-y-1/2 transition-opacity ${selectedGameMode === GAME_MODES.QUICK_PLAY.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100 group-focus-within:opacity-100'}`} />
            <button className={`cursor-pointer`} onClick={() => {
              setSelectedGameMode(GAME_MODES.QUICK_PLAY.id);

            }}>Start Game</button>
          </div>
          <div className="relative group text-center">
            <div className={`arrow absolute -left-4 top-0 -translate-y-1/2 transition-opacity opacity-0 group-hover:opacity-100 group-focus-within:opacity-100`} />
            <button className={`cursor-pointer`} onClick={() => {
              setIsOpen(true);

            }}>How to Play</button>
          </div>

        </div>
        <PokeballSplash href={selectedGameMode ? `${selectedGameMode}/select` : null} buttonText="Press!" />
        {isOpen && (
          <HowToPlay isOpen={isOpen} onClose={() => setIsOpen(false)} />
        )}
      </section>
    </>
  );
}
