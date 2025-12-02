"use client"

import Victory from "@/components/Results/Victory";
import Defeat from "@/components/Results/Defeat";
import Tie from "@/components/Results/Tie";
import { useEffect } from 'react';
import { useGameContext } from '@/contexts/GameContext';
import { clearGameState } from '@/utils/gameStorage';
import { useRouter, usePathname } from 'next/navigation';

export default function Home({ debugMode = false }) {
  const router = useRouter();
  const pathname = usePathname();
  const { matchCards, setMatchCards, isPlayerVictory, setIsPlayerVictory } = useGameContext();

  useEffect(() => {
    clearGameState();

    // if (matchCards.length === 0 && debugMode === false) {
    //   const gameMode = pathname.split('/').filter(Boolean)[0];
    //   router.push(`/${gameMode}/select`);
    //   return;
    // }

    // Calculate victory by counting cards with isPlayerCard property
    const playerCardCount = matchCards.filter(card => card.isPlayerCard === true).length;
    const cpuCardCount = matchCards.filter(card => card.isPlayerCard === false).length;

    if (playerCardCount > cpuCardCount) {
      setIsPlayerVictory(true);
    } else if (cpuCardCount > playerCardCount) {
      setIsPlayerVictory(false);
    } else {
      setIsPlayerVictory(null);
    }
  }, []);

  return (
    <>
      <section className="overflow-hidden relative h-full flex flex-col gap-4 bg-white rounded-xl" >
        {isPlayerVictory === true ? (
          <Victory />
        ) : isPlayerVictory === false ? (
          <Defeat />
        ) : (
          <Tie />
        )}
      </section>
    </>
  );
}
