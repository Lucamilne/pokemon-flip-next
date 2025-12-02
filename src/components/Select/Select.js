import { useState, useEffect, useMemo } from 'react';
import { usePathname } from 'next/navigation';
import { fetchStarterCards, fetchStrongCards, fetchAllCards } from '@/utils/cardHelpers.js';
import PokeballSplash from "../PokeballSplash/PokeballSplash.js";
import Card from "../Card/Card.js";
import Help from "../Help/Help.js";
import Profile from "../Profile/Profile.js"
import styles from './retro.module.css';
import { useGameContext } from '@/contexts/GameContext';
import { clearGameState } from '@/utils/gameStorage';


const basePath = process.env.NODE_ENV === 'production' ? '/pokemon-flip-next' : '';

export default function Select() {
    const pathname = usePathname();
    // Extract root path (e.g., "/quickplay/select" -> "/quickplay")
    const rootPath = '/' + pathname.split('/').filter(Boolean)[0];
    const [playerHand, setPlayerHand] = useState([null, null, null, null, null]);
    const [pokeballIsOpen, setPokeballIsOpen] = useState(false);
    const [isPokeballDisabled, setIsPokeballDisabled] = useState(true);
    const [searchString, setSearchString] = useState('');
    const { setSelectedPlayerHand, selectedGameMode } = useGameContext();
    const [lastPokemonCardSelected, setLastPokemonCardSelected] = useState(null);
    const playerCardLibrary = useMemo(() => {
        return pathname.startsWith('/quickplay') ? fetchAllCards() : fetchStarterCards();
    }, [pathname]);

    useEffect(() => {
        clearGameState();
        if (!pokeballIsOpen) setPokeballIsOpen(true);
    }, [])

    useEffect(() => {
        if (playerHand.every(card => card !== null)) {
            setSelectedPlayerHand(playerHand);
            setIsPokeballDisabled(false);
            setPokeballIsOpen(false);
        }
    }, [playerHand])

    const helperText = "Choose your hand!"

    const selectedCardIds = useMemo(() =>
        new Set(playerHand.filter(Boolean).map(card => card.id))
        , [playerHand]);

    const togglePokemonCardSelection = (pokemonCard) => {
        if (!pokemonCard) return;

        // Check if card is already in hand
        const cardIndex = playerHand.findIndex(card => card?.id === pokemonCard.id);

        if (cardIndex !== -1) {
            // Card is in hand, unselect it
            setPlayerHand(prev => {
                const newHand = [...prev];
                newHand[cardIndex] = null;
                return newHand;
            });
            return;
        }

        // Card not in hand, add it to first available slot
        setPlayerHand(prev => {
            const firstNullIndex = prev.findIndex(card =>
                card === null);
            if (firstNullIndex === -1) return prev; // Hand is full

            const newHand = [...prev];
            newHand[firstNullIndex] = pokemonCard;
            return newHand;
        });

        setLastPokemonCardSelected(pokemonCard)
        // setSearchString("");
    }

    return (
        <div className="overflow-hidden relative h-full flex flex-col rounded-xl" >
            <div className="px-7 pt-4 pb-6 flex justify-between items-center hand-top-container">
                <div className="relative font-press-start">
                    <input
                        type="text"
                        id="search"
                        className={`${styles['snes-input']}`}
                        style={{
                            borderImageSource: `url('${basePath}/images/border-image.png')`,
                            borderImageSlice: '12',
                            borderImageWidth: '12px',
                            borderImageOutset: '6px',
                            borderImageRepeat: 'initial'
                        }}
                        placeholder='Search Cards'
                        value={searchString}
                        onChange={(e) => setSearchString(e.target.value)}
                        maxLength={18}
                    />
                    {searchString !== "" && (
                        <button
                            onClick={() => setSearchString('')}
                            className="px-1 cursor-pointer absolute right-3 top-1/2 -translate-y-1/2 text-neutral-600 hover:text-neutral-900 text-lg leading-none"
                            aria-label="Clear search"
                        >
                            X
                        </button>
                    )}
                </div>
                <h1 className="header-text text-2xl text-hop">
                    {helperText.split('').map((char, index) => (<span key={index} style={{
                        animationDelay: `${(index + 1) * 50}ms`
                    }}>{char}</span>))}

                </h1>
            </div>
            <div className='grow flex overflow-y-auto'>
                <div className="relative bg-theme-blue hide-scrollbar overflow-y-auto flex">
                    <div className="grid grid-cols-[repeat(2,124px)] lg:grid-cols-[repeat(2,174px)] auto-rows-min gap-4 p-4">
                        {playerCardLibrary
                            .filter(pokemonCard => {
                                const trimmedSearch = searchString.trim();
                                if (pokemonCard === null) return trimmedSearch === '';
                                return pokemonCard.name.toLowerCase().includes(trimmedSearch.toLowerCase())
                            }
                            )
                            .map((pokemonCard, index) => {
                                const isInHand = pokemonCard && selectedCardIds.has(pokemonCard.id);
                                return (
                                    <button
                                        className={`relative rounded-md aspect-square transition-transform shadow-md/30 ${isInHand ? 'ring-5 ring-lime-300' : ''}`}
                                        key={index}
                                        onClick={() => togglePokemonCardSelection(pokemonCard)}
                                    >
                                        {pokemonCard && (
                                            <Card isUnselected={!isInHand} pokemonCard={pokemonCard} index={index} isDraggable={true} />
                                        )}
                                    </button>
                                )
                            })}
                    </div>
                </div>
                <Profile playerHand={playerHand} lastPokemonCardSelected={lastPokemonCardSelected} />
            </div>
            <div className="relative grid grid-cols-[repeat(5,124px)] lg:grid-cols-[repeat(5,174px)] items-center gap-4 hand-bottom-container pt-8 p-4 w-full justify-center">
                {playerHand.map((pokemonCard, index) => {
                    return (
                        <button className={`relative aspect-square ${pokemonCard ? "cursor-pointer" : ""}`} key={index} onClick={() => togglePokemonCardSelection(pokemonCard)}>
                            <div className="absolute top-1 left-1 bottom-1 right-1 rounded-md m-1 bg-pokedex-inner-blue flex justify-center items-center">
                                <span className='header-text text-2xl'>{index + 1}</span>
                            </div>

                            {pokemonCard && (
                                <Card pokemonCard={pokemonCard} index={index} isDraggable={false} />
                            )}
                        </button>
                    )
                })}
                {playerHand.every(card => card === null) && (
                    <Help customClass="!absolute !-top-16 !right-4" text="Add cards to your hand!" />
                )}
            </div>
            <PokeballSplash pokeballIsOpen={pokeballIsOpen} disabled={isPokeballDisabled} href={isPokeballDisabled ? null : `${rootPath}/play`} buttonText='Fight!' />
        </div>
    )
}