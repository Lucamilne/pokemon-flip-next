"use client"

import PokeballSplash from "@/components/PokeballSplash/PokeballSplash.js";
// import ResultTransition from "@/components/ResultTransition/ResultTransition";
import { GAME_MODES } from '@/constants/gameModes';
import { useGameContext } from '@/contexts/GameContext';

export default function Home() {
  const { selectedGameMode, setSelectedGameMode } = useGameContext();

  return (
    <>
      <section className="overflow-hidden relative h-full flex flex-col gap-4 bg-neutral-400 rounded-xl" >
        {/* <Image draggable={false} width={264} height={132} className="absolute z-10 top-1/2 left-1/2" alt="Pokemon Flip logo" src={pokemonFlipLogo} /> */}
        <div className="absolute z-10 mt-56 top-1/2 left-1/2 -translate-x-1/2 font-press-start grid grid-cols-1 gap-2 text-2xl">
          <div className="relative group text-center">
            <div className="arrow absolute -left-4 top-0 -translate-y-1/2 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 group-has-[:disabled]:!opacity-0 transition-opacity" />
            <button disabled={true} className="text-center disabled:opacity-30">New Game</button>
          </div>
          <div className="relative group text-center">
            <div className="arrow absolute -left-4 top-0 -translate-y-1/2 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 group-has-[:disabled]:!opacity-0 transition-opacity" />
            <button disabled={true} className="text-center disabled:opacity-30">Continue</button>
          </div>
          <div className="relative group text-center">
            <div className={`arrow absolute -left-4 top-0 -translate-y-1/2 transition-opacity ${selectedGameMode === GAME_MODES.QUICK_PLAY.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100 group-focus-within:opacity-100'}`} />
            <button className={`cursor-pointer`} onClick={() => {
              setSelectedGameMode(GAME_MODES.QUICK_PLAY.id);

            }}>Quick Play</button>
          </div>
        </div>
        <PokeballSplash href={selectedGameMode ? `${selectedGameMode}/select` : null} buttonText="Press!" />
        {/* <ResultTransition debugMode={true} /> */}
      </section>
    </>
  );
}
