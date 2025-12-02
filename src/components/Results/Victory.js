import { useMemo } from 'react';
import { useGameContext } from '@/contexts/GameContext';
import Link from 'next/link'
import Image from 'next/image'
import VictoryImage from "@/assets/images/victory.webp";
import Card from "../Card/Card.js";
import { GAME_MODES } from '@/constants/gameModes';

export default function Victory({ debugMode = false }) {
    const { matchCards, selectedGameMode } = useGameContext();

    const filteredMatchCards = useMemo(() => {
        if (selectedGameMode === GAME_MODES.CAREER.id) {
            return matchCards.filter(card => card.isPlayerCard === true && !card.playerOwned);
        }
        return [];
    }, [matchCards]);

    const victoryTextArray = [
        "NICE HAHA",
        "HE'S ALRITE",
        "THAT COULD BE USEFUL (YOU).",
        "COMPLETED IT MATE.",
        "UNSTOPPABLE FORCE",
        "ASCENDED TO GOD-TIER",
        "THE PROPHECY IS FULFILLED",
        "DECK MASTERY ACHIEVED",
        "EZ. NEXT.",
        "THE ONLY QUESTION WAS WHEN",
        "THIS IS YOUR NEW REALITY",
        "PERFECTION IS EXHAUSTING"
    ];

    const randomVictoryText = useMemo(() => {
        return victoryTextArray[Math.floor(Math.random() * victoryTextArray.length)];
    }, []);

    return (
        <div className='fade-in h-full bg-linear-to-b from-transparent from-10% via-ground-200 to-ground-400 flex flex-col'>
            <div className="text-2xl font-bold p-16 flex justify-center">
                <Image loading="eager" draggable={false} width={1315} height={777} alt="Pokemon Flip logo" className='max-w-xl' src={VictoryImage} />
            </div>
            <div className='default-tile mx-8 mb-8 p-10 border-8 h-full'>
                {selectedGameMode === GAME_MODES.QUICK_PLAY.id && (
                    <div className='size-full flex justify-center items-center'>
                        <div className="relative group text-center font-press-start text-lg">
                            <h1 className="header-text text-2xl text-hop uppercase mb-12">
                                {randomVictoryText.split('').map((char, index) => (<span key={index} style={{
                                    animationDelay: `${(index + 1) * 50}ms`
                                }}>{char}</span>))}

                            </h1>
                            <div className={`arrow absolute -left-4 top-1 -translate-y-1/2 transition-opacity ${selectedGameMode === GAME_MODES.QUICK_PLAY.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100 group-focus-within:opacity-100'}`} />
                            <Link className={`cursor-pointer`} href={`/${selectedGameMode}/select`}>Play Again?</Link>
                        </div>
                    </div>
                )}
                {filteredMatchCards && filteredMatchCards.length > 0 && (
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