import { useState, useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { fetchStarterCards, createCard } from '@/utils/cardHelpers.js';
import PokeballSplash from "../PokeballSplash/PokeballSplash.js";
import Card from "../Card/Card.js";
import Help from "../Help/Help.js";
import Profile from "../Profile/Profile.js"
import styles from './retro.module.css';
import { useGameContext } from '@/contexts/GameContext';
import { useAuth } from '@/contexts/AuthContext';

const basePath = import.meta.env.PROD ? '/pokemon-flip-next' : '';

export default function Select() {
    const location = useLocation();
    const pathname = location.pathname;
    // Extract root path (e.g., "/quickplay/select" -> "/quickplay")
    const rootPath = '/' + pathname.split('/').filter(Boolean)[0];
    const [playerHand, setPlayerHand] = useState([null, null, null, null, null]);
    const [pokeballIsOpen, setPokeballIsOpen] = useState(false);
    const [isPokeballDisabled, setIsPokeballDisabled] = useState(true);
    const [searchString, setSearchString] = useState('');
    const { setSelectedPlayerHand, resetGameState } = useGameContext();
    const [lastPokemonCardSelected, setLastPokemonCardSelected] = useState(null);
    const [showConfirm, setShowConfirm] = useState(false);
    const [playerCardLibrary, setPlayerCardLibrary] = useState([]);
    const { user, userCollection, isLoadingCollection } = useAuth();

    useEffect(() => {
        // Reset game state when arriving at select screen (prepares for new game)
        resetGameState();
        if (!pokeballIsOpen) setPokeballIsOpen(true);
    }, [])

    useEffect(() => {
        const ownedPokemonNames = Object.keys(userCollection);

        if (ownedPokemonNames.length > 0) {
            const ownedCards = ownedPokemonNames
                .map(name => createCard(name, true))
                .sort((a, b) => a.id - b.id);
            setPlayerCardLibrary(ownedCards);
        } else {
            // Fallback to starters if collection is empty
            setPlayerCardLibrary(fetchStarterCards(true));
        }
    }, [userCollection])

    const closePokeball = () => {
        setIsPokeballDisabled(false);
        setPokeballIsOpen(false);
    }

    useEffect(() => {
        if (playerHand.every(card => card !== null)) {
            setLastPokemonCardSelected(null);
            setShowConfirm(true);
            setSelectedPlayerHand(playerHand);
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
    }

    return (
        <div className="overflow-hidden relative h-full flex flex-col md:rounded-xl" >
            <div className="px-7 pt-4 pb-6 flex justify-between gap-4 items-center hand-top-container">
                <div className="relative font-press-start">
                    <input
                        type="text"
                        id="search"
                        className={`${styles['snes-input']} w-full md:w-auto`}
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
                <h1 className="hidden md:block text-right header-text text-xl lg:text-2xl text-hop">
                    {helperText.split('').map((char, index) => (<span key={index} style={{
                        animationDelay: `${(index + 1) * 50}ms`
                    }}>{char}</span>))}

                </h1>
            </div>
            <div className='grow flex overflow-y-auto'>
                <div className={`relative bg-pokedex-lighter-blue hide-scrollbar p-2 md:p-4 ${isLoadingCollection ? 'overflow-hidden' : 'overflow-y-auto'}`}>
                    <div className="grid grid-cols-[repeat(2,72px)] md:grid-cols-[repeat(3,124px)] auto-rows-min gap-1 md:gap-4">
                        {isLoadingCollection ? (
                            <>
                                {Array.from({ length: 24 }).map((_, index) => (
                                    <div
                                        key={index}
                                        className="fade-in-out aspect-square bg-pokedex-inner-blue/15 rounded-md"
                                        style={{
                                            animationDelay: `${index * 50}ms`,
                                            opacity: 0
                                        }}
                                    />
                                ))}
                                <p className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-2xl header-text text-hop flex'>{"...".split('').map((char, index) => (<span key={index} style={{
                                    animationDelay: `${(index + 1) * 50}ms`
                                }}> {char}</span>))}</p>
                            </>
                        ) : (
                            <>
                                {
                                    playerCardLibrary
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
                                                    className={`relative rounded-md aspect-square transition-transform shadow-md/15 ${isInHand ? 'ring-3 md:ring-5 ring-lime-300' : ''}`}
                                                    key={pokemonCard.id}
                                                    onClick={() => togglePokemonCardSelection(pokemonCard)}
                                                >
                                                    {pokemonCard && (
                                                        <Card isUnselected={!isInHand} pokemonCard={pokemonCard} index={index} isDraggable={false} />
                                                    )}
                                                </button>
                                            )
                                        })
                                }
                            </>
                        )}
                    </div>
                </div>
                <Profile playerHand={playerHand} setPlayerHand={setPlayerHand} lastPokemonCardSelected={lastPokemonCardSelected} />
            </div>
            {showConfirm && (
                <div className="absolute inset-0 bg-black/40" />
            )}
            <div className={`${showConfirm ? '-translate-y-20' : 'translate-y-0'} transition-transform relative grid grid-cols-[repeat(5,72px)] md:grid-cols-[repeat(5,124px)] items-center gap-1 md:gap-4 hand-bottom-container pt-7 p-3 md:pt-8 md:p-4 w-full justify-center`}>
                {playerHand.map((pokemonCard, index) => {
                    return (
                        <button className={`relative aspect-square ${pokemonCard && !showConfirm ? "cursor-pointer" : ""}`} key={index} onClick={() => togglePokemonCardSelection(pokemonCard)} disabled={showConfirm}>
                            <div className="absolute top-1 left-1 bottom-1 right-1 rounded-md m-1 bg-pokedex-inner-blue flex justify-center items-center">
                                <span className='header-text text-xl md:text-2xl'>{index + 1}</span>
                            </div>

                            {pokemonCard && (
                                <div className='slide-in-blurred-top'>
                                    <Card pokemonCard={pokemonCard} index={index} isDraggable={false} />
                                </div>
                            )}
                        </button>
                    )
                })}
                {playerHand.every(card => card === null) && (
                    <Help customClass="!hidden md:!block !absolute !-top-16 !right-4" text="Add cards to your hand!" />
                )}
                <div className='bg-linear-to-b from-pokedex-blue to-pokedex-dark-blue h-20 w-full absolute -bottom-20 flex gap-4 justify-center items-center font-press-start'>
                    <button onClick={() => { setPlayerHand([null, null, null, null, null]); setShowConfirm(false); }} className={`${styles['nes-btn']} ${styles['is-error']} cursor-pointer`}>Clear</button>
                    <button onClick={closePokeball} className={`${styles['nes-btn']} ${styles['is-success']} cursor-pointer`}>Confirm</button>
                </div>
            </div>
            <PokeballSplash pokeballIsOpen={pokeballIsOpen} disabled={isPokeballDisabled} href={isPokeballDisabled ? null : `${rootPath}/play`} buttonText='Fight!' />
        </div >
    )
}