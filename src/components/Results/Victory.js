import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { useGameContext } from '@/contexts/GameContext';
import { Link } from 'react-router-dom';
import VictoryImage from "@/assets/images/victory.webp";
import Card from "../Card/Card.js";
import { GAME_MODES } from '@/constants/gameModes';

export default function Victory({ matchAwards, debugMode = false }) {
    const location = useLocation();
    const pathname = location.pathname;
    const { matchCards, selectedGameMode } = useGameContext();

    const isQuickplay = pathname?.includes('quickplay') ?? false;

    const filteredMatchCards = useMemo(() => {
        if (selectedGameMode === GAME_MODES.CAREER.id) {
            return matchCards.filter(card => card.isPlayerCard === true && !card.playerOwned);
        }
        return [];
    }, [matchCards]);

    return (
        <div className='fade-in h-full bg-linear-to-b from-transparent from-10% via-ground-200 to-ground-400 flex flex-col'>
            <div className="font-bold px-16 py-6 flex justify-center">
                <img loading="eager" draggable={false} width={1315} height={777} alt="Pokemon Flip logo" className='max-w-xl' src={VictoryImage} />
            </div>
            <div className='p-10 h-full'>
                {(selectedGameMode === GAME_MODES.QUICK_PLAY.id || isQuickplay) && (
                    <div className='size-full'>
                        {process.env.NODE_ENV === 'development' && matchAwards && matchAwards.length > 0 && (
                            <div className="mb-8">
                                <h2 className="text-xl font-press-start text-center mb-6">
                                    Match Awards
                                </h2>
                                <div className="grid grid-cols-3 gap-4">
                                    {matchAwards.map((award, index) => (
                                        <div key={index} className="default-tile p-4 py-8 border-4 border-black">
                                            {/* Award Title */}
                                            <div className="text-center mb-3">
                                                <span className="font-press-start text-sm">
                                                    {award.label}
                                                </span>
                                            </div>

                                            {/* Award Card */}
                                            <div className="flex justify-center">
                                                <div className="w-[124px]">
                                                    <Card pokemonCard={award.card} isDraggable={false} />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                        <div className="relative group text-center font-press-start text-lg">
                            <div className={`arrow absolute -left-4 top-1 -translate-y-1/2 transition-opacity ${selectedGameMode === GAME_MODES.QUICK_PLAY.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100 group-focus-within:opacity-100'}`} />
                            <Link className={`cursor-pointer`} to={`${isQuickplay ? "/quickplay" : "/career"}/select`}>Play Again?</Link>
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