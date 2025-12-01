import { useEffect, useState, useMemo } from 'react';
import { useGameContext } from '@/contexts/GameContext';
import { useRouter, usePathname } from 'next/navigation';
import { clearGameState } from '@/utils/gameStorage';
import Link from 'next/link'
import Image from 'next/image'
import Card from "../Card/Card.js";
import { GAME_MODES } from '@/constants/gameModes';

export default function Tie({ debugMode = false }) {
    const { matchCards, setMatchCards, selectedGameMode } = useGameContext();
    const [isPlayerVictory, setIsPlayerVictory] = useState(null); // null = tie, true = player wins, false = cpu wins

    const filteredMatchCards = useMemo(() => {
        if (selectedGameMode === GAME_MODES.CAREER.id) {
            return matchCards.filter(card => card.isPlayerCard === true && !card.playerOwned);
        }
        return [];
    }, [matchCards, selectedGameMode]);

    return (
        <div className='h-full bg-linear-to-b from-transparent from-10% via-ground-200 to-ground-400 flex flex-col'>
            <div className="text-2xl font-bold p-16 flex justify-center">
                {/* <Image loading="eager" draggable={false} width={1315} height={777} alt="Pokemon Flip logo" className='max-w-xl' src={Victory} /> */}
            </div>
            <div className='default-tile mx-8 mb-8 p-10 border-8 h-full'>
                {selectedGameMode === GAME_MODES.QUICK_PLAY.id && (
                    <div className='size-full flex justify-center items-center'>
                        <div className="relative group text-center font-press-start text-lg">
                            <div className={`arrow absolute -left-4 top-1 -translate-y-1/2 transition-opacity ${selectedGameMode === GAME_MODES.QUICK_PLAY.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100 group-focus-within:opacity-100'}`} />
                            <Link className={`cursor-pointer hover:text-sky-400`} href={`/${selectedGameMode}/select`}>Play Again?</Link>
                        </div>
                    </div>
                )}
                {isPlayerVictory && filteredMatchCards && filteredMatchCards.length > 0 && (
                    <>
                        <h2 className='text-2xl text-center header-text text-hop mb-4'>
                            {"Choose a reward!".split('').map((char, index) => (<span key={index} style={{
                                animationDelay: `${(index + 1) * 50}ms`
                            }}>{char}</span>))}
                        </h2>
                        <div className="inline-grid grid-cols-[repeat(2,124px)] lg:grid-cols-[repeat(2,174px)] p-4 bg-black/15 auto-rows-min gap-4 rounded-md">
                            {filteredMatchCards.map((pokemonCard, index) => (
                                <button className={`relative aspect-square ${pokemonCard ? "cursor-pointer" : ""}`} key={index} onClick={() => togglePokemonCardSelection(pokemonCard)}>
                                    <div className="absolute top-1 left-1 bottom-1 right-1 rounded-md m-1 bg-black/15 flex justify-center items-center">
                                        <span className='header-text text-2xl'>{index + 1}</span>
                                    </div>

                                    {pokemonCard && (
                                        <Card pokemonCard={pokemonCard} index={index} isDraggable={false} />
                                    )}
                                </button>
                            ))}
                        </div>
                    </>
                )
                }
            </div>

        </div>
    );
}