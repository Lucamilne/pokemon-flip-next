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
      <section className="overflow-hidden relative h-full flex flex-col gap-4 bg-neutral-400 md:rounded-xl" >
        <div className="absolute z-10 bottom-8 left-1/2 -translate-x-1/2 font-press-start flex flex-col items-center gap-2 text-xl">
          <div className="relative group text-center">
            <div className="arrow absolute -left-6 bottom-0 -translate-y-1/2 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 group-has-[:disabled]:!opacity-0 transition-opacity" />
            <button disabled={true} className="text-center disabled:opacity-30">New Game</button>
          </div>
          <div className="relative group text-center">
            <div className="arrow absolute -left-6 bottom-0 -translate-y-1/2 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 group-has-[:disabled]:!opacity-0 transition-opacity" />
            <button disabled={true} className="text-center disabled:opacity-30">Continue</button>
          </div>
          <div className="relative group text-center">
            <div className={`arrow absolute -left-6 bottom-0 -translate-y-1/2 transition-opacity opacity-0 group-hover:opacity-100 group-focus-within:opacity-100`} />
            <button className={`cursor-pointer whitespace-nowrap`} onClick={() => {
              setIsOpen(true);

            }}>How to Play</button>
          </div>
          <div className="relative group text-center">
            <div className={`arrow absolute -left-6 bottom-0 -translate-y-1/2 transition-opacity ${selectedGameMode === GAME_MODES.QUICK_PLAY.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100 group-focus-within:opacity-100'}`} />
            <button className={`cursor-pointer whitespace-nowrap`} onClick={() => {
              setSelectedGameMode(GAME_MODES.QUICK_PLAY.id);

            }}>Quick Play</button>
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
