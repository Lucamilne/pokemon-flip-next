import { useState, useEffect, useMemo, useCallback } from 'react';
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
    const rootPath = '/' + pathname.split('/').filter(Boolean)[0];
    const [playerHand, setPlayerHand] = useState([null, null, null, null, null]);
    const [pokeballIsOpen, setPokeballIsOpen] = useState(false);
    const [isPokeballDisabled, setIsPokeballDisabled] = useState(true);
    const [searchString, setSearchString] = useState('');
    const [lastPokemonCardSelected, setLastPokemonCardSelected] = useState(null);
    const [showConfirm, setShowConfirm] = useState(false);
    const [showProfile, setShowProfile] = useState(true)

    const { setSelectedPlayerHand, resetGameState, lastSelectedHand, setLastSelectedHand, isMobile } = useGameContext();
    const { userCollection, isLoadingCollection } = useAuth();

    useEffect(() => {
        // Reset game state when arriving at select screen (prepares for new game)
        resetGameState();
        if (!pokeballIsOpen) setPokeballIsOpen(true);
    }, [])

    const playerCardLibrary = useMemo(() => {
        const ownedPokemonNames = Object.keys(userCollection);

        if (ownedPokemonNames.length > 0) {
            return ownedPokemonNames
                .map(name => createCard(name, true))
                .sort((a, b) => a.id - b.id);
        } else {
            // Fallback to starters if collection is empty
            return fetchStarterCards(true);
        }
    }, [userCollection]);

    const closePokeball = () => {
        setIsPokeballDisabled(false);
        setPokeballIsOpen(false);
    }

    useEffect(() => {
        if (!isMobile) return;

        setShowProfile(!searchString);
    }, [searchString]);

    useEffect(() => {
        if (playerHand.every(card => card !== null)) {
            setLastPokemonCardSelected(null);
            setShowConfirm(true);
            setSelectedPlayerHand(playerHand);
        } else {
            setShowConfirm(false);
        }
    }, [playerHand])

    const helperTextChars = useMemo(() => "Choose your hand!".split(''), []);

    const selectedCardIds = useMemo(() =>
        new Set(playerHand.filter(Boolean).map(card => card.id))
        , [playerHand]);

    const inputBorderStyle = useMemo(() => ({
        borderImageSource: `url('${basePath}/images/border-image.png')`,
        borderImageSlice: '12',
        borderImageWidth: '12px',
        borderImageOutset: '6px',
        borderImageRepeat: 'initial'
    }), []);

    const filteredCards = useMemo(() => {
        const trimmedSearch = searchString.trim().toLowerCase();
        if (!trimmedSearch) return playerCardLibrary;

        return playerCardLibrary.filter(pokemonCard =>
            pokemonCard?.name.toLowerCase().includes(trimmedSearch)
        );
    }, [searchString, playerCardLibrary]);

    const togglePokemonCardSelection = useCallback((pokemonCard) => {
        if (!pokemonCard) return;

        // setSearchString(""); // is this useful? Undecided. Commented out for now.

        setPlayerHand(prev => {
            const cardIndex = prev.findIndex(card => card?.id === pokemonCard.id);

            if (cardIndex !== -1) {
                // Card is in hand, unselect it
                const newHand = [...prev];
                newHand[cardIndex] = null;
                return newHand;
            }

            // Card not in hand, add it to first available slot
            const firstNullIndex = prev.findIndex(card => card === null);
            if (firstNullIndex === -1) return prev; // Hand is full

            const newHand = [...prev];
            newHand[firstNullIndex] = pokemonCard;
            return newHand;
        });

        setLastPokemonCardSelected(pokemonCard);
    }, [])

    return (
        <div className="relative h-full flex flex-col md:rounded-xl bg-pokedex-lighter-blue" >
            <div className="px-7 pt-4 pb-6 flex justify-between gap-4 items-center hand-top-container">
                <div className="relative font-press-start">
                    <input
                        type="text"
                        id="search"
                        className={`${styles['snes-input']} w-full md:w-auto`}
                        autoComplete="off"
                        style={inputBorderStyle}
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
                    {helperTextChars.map((char, index) => (<span key={index} style={{
                        animationDelay: `${(index + 1) * 50}ms`
                    }}>{char}</span>))}

                </h1>
            </div>
            <div className="relative grow flex flex-col-reverse md:flex-row overflow-y-auto">
                <div className={`h-full relative hide-scrollbar p-2 md:p-4 ${isLoadingCollection ? 'overflow-y-hidden' : 'overflow-y-auto'}`}>
                    <div className="grid grid-cols-[repeat(4,72px)] place-content-center md:grid-cols-[repeat(4,124px)] auto-rows-min gap-1 md:gap-4">
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
                                    filteredCards.map((pokemonCard, index) => {
                                        const isInHand = pokemonCard && selectedCardIds.has(pokemonCard.id);

                                        return (
                                            <button
                                                className={`cursor-pointer relative rounded-md aspect-square transition-transform shadow-md/15 ${isInHand ? 'ring-3 md:ring-5 ring-lime-300' : ''}`}
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
                {showProfile && (
                    <Profile
                        playerHand={playerHand}
                        lastSelectedHand={lastSelectedHand}
                        setPlayerHand={setPlayerHand}
                        lastPokemonCardSelected={lastPokemonCardSelected}
                        onClose={isMobile ? () => setShowProfile(false) : undefined}
                    />
                )}
            </div>
            {showConfirm && (
                <div className="absolute inset-0 bg-black/60" />
            )}
            <div className={`${showConfirm ? '-translate-y-20' : 'translate-y-0'} transition-transform relative grid grid-cols-[repeat(5,72px)] md:grid-cols-[repeat(5,124px)] items-center gap-1 md:gap-4 hand-bottom-container pt-7 p-3 md:pt-8 md:p-4 w-full justify-center`}>
                {playerHand.map((pokemonCard, index) => {
                    return (
                        <button className={`relative aspect-square ${pokemonCard ? "cursor-pointer" : ""}`} key={index} onClick={() => togglePokemonCardSelection(pokemonCard)}>
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
                    <button onClick={() => { setPlayerHand([null, null, null, null, null]); }} className={`${styles['nes-btn']} ${styles['is-error']} cursor-pointer`}>Clear</button>
                    <button onClick={() => { closePokeball(); setLastSelectedHand(playerHand) }} className={`${styles['nes-btn']} ${styles['is-success']} cursor-pointer`}>Confirm</button>
                </div>
            </div>
            <PokeballSplash pokeballIsOpen={pokeballIsOpen} disabled={isPokeballDisabled} href={isPokeballDisabled ? null : `${rootPath}/play`} buttonText='Fight!' />
        </div >
    )
}