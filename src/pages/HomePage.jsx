import { useState } from 'react';
import PokeballSplash from "@/components/PokeballSplash/PokeballSplash.js";
import HowToPlay from "@/components/HowToPlay/HowToPlay";

export default function HomePage() {
  const [isOpen, setIsOpen] = useState(false);
  const [hasStartedGame, setHasStartedGame] = useState(false)

  return (
    <>
      <section className="overflow-hidden relative h-full flex flex-col gap-4 bg-neutral-400 rounded-xl" >
        <div className="absolute z-10 bottom-8 left-1/2 -translate-x-1/2 font-press-start grid grid-cols-1 gap-2 text-xl">
          <div className="relative group text-center">
            <div className="arrow absolute -left-2 top-1 -translate-y-1/2 transition-opacity opacity-100" />
            <button className={`cursor-pointer`} onClick={() => {
              setHasStartedGame(true);
            }}>Start Game</button>
          </div>
          <div className="relative group text-center">
            <div className={`arrow absolute -left-2 top-1 -translate-y-1/2 transition-opacity opacity-0 group-hover:opacity-100 group-focus-within:opacity-100`} />
            <button className={`cursor-pointer`} onClick={() => {
              setIsOpen(true);
            }}>How to Play</button>
          </div>

        </div>
        <PokeballSplash href={hasStartedGame ? "quickplay/select" : null} buttonText="Press!" />
        {isOpen && (
          <HowToPlay isOpen={isOpen} onClose={() => setIsOpen(false)} />
        )}
      </section>
    </>
  );
}
