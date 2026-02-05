import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { fetchStarterCards, createCard } from '@/utils/cardHelpers.js';
import PokeballSplash from "../PokeballSplash/PokeballSplash.js";
import Card from "../Card/Card.js";
import Help from "../Help/Help.js";
import Profile from "../Profile/Profile.js"
import styles from '@/retro.module.css';
import { useGameContext } from '@/contexts/GameContext';
import { useAuth } from '@/contexts/AuthContext';

const basePath = import.meta.env.PROD ? '/pokemon-flip-next' : '';

export default function Select() {
    const location = useLocation();
    const pathname = location.pathname;
    const rootPath = '/' + pathname.split('/').filter(Boolean)[0];

    const { setSelectedPlayerHand, resetGameState, lastSelectedHand, setLastSelectedHand, isMobile } = useGameContext();
    const { userCollection, isLoadingCollection } = useAuth();

    const [playerHand, setPlayerHand] = useState([null, null, null, null, null]);
    const [pokeballIsOpen, setPokeballIsOpen] = useState(false);
    const [isPokeballDisabled, setIsPokeballDisabled] = useState(true);
    const [searchString, setSearchString] = useState('');
    const [lastPokemonCardSelected, setLastPokemonCardSelected] = useState(null);
    const [showConfirm, setShowConfirm] = useState(false);
    const [showProfile, setShowProfile] = useState(true);
    const [showHelp, setShowHelp] = useState(false);
    const [sortByStrength, setSortByStrength] = useState(() => {
        return sessionStorage.getItem('sortByStrength') === 'true';
    });
    const [showProfilesOnMobile, setShowProfilesOnMobile] = useState(() => {
        return sessionStorage.getItem('showProfilesOnMobile') !== 'false';
    });

    useEffect(() => {
        sessionStorage.setItem('sortByStrength', sortByStrength);
    }, [sortByStrength]);

    useEffect(() => {
        sessionStorage.setItem('showProfilesOnMobile', showProfilesOnMobile);
    }, [showProfilesOnMobile]);

    const handleCloseProfile = useCallback(() => setShowProfile(false), []);

    useEffect(() => {
        resetGameState();

        if (!pokeballIsOpen) setPokeballIsOpen(true);

        const helpTimer = setTimeout(() => {
            setShowHelp(true);
        }, 3000);

        return () => clearTimeout(helpTimer);
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
        if (!isMobile && !showProfile) {
            setShowProfile(true);
        }
    }, [isMobile]);

    useEffect(() => {
        const emptyHand = playerHand.every(card => card === null);
        const fullHand = playerHand.every(card => card !== null);

        if (emptyHand) setLastPokemonCardSelected(null);

        setShowConfirm(fullHand);

        if (fullHand) {
            setShowProfile(false);
            setSelectedPlayerHand(playerHand);
        };
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
        let cards = trimmedSearch
            ? playerCardLibrary.filter(pokemonCard =>
                pokemonCard?.name.toLowerCase().includes(trimmedSearch)
              )
            : playerCardLibrary;

        if (isMobile && trimmedSearch) {
            setShowProfile(false);
        }

        if (sortByStrength) {
            return [...cards].sort((a, b) => b.statWeight - a.statWeight);
        }

        return cards;
    }, [searchString, playerCardLibrary, sortByStrength]);

    const togglePokemonCardSelection = useCallback((pokemonCard) => {
        if (!pokemonCard) return;

        setSearchString(""); // is this useful? Undecided.

        const isCardInHand = playerHand.some(card => card?.id === pokemonCard.id);

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

        // Only show profile on mobile when adding a card (not removing)
        if (isMobile && !isCardInHand) {
            setShowProfile(true);
        }

        setLastPokemonCardSelected(pokemonCard);
    }, [playerHand, isMobile])

    const restoreLastSelectedHand = () => {
        const filteredHand = lastSelectedHand.map(pokemonCard => {
            if (!pokemonCard) return null;

            const isOwned = hasCard(pokemonCard.name) || pokemonCard.starter;
            return isOwned ? pokemonCard : null;
        });

        setPlayerHand(filteredHand);
    };

    return (
        <div className="relative overflow-y-hidden h-full flex flex-col md:rounded-xl bg-pokedex-lighter-blue" >
            <div className="px-7 py-4 md:pb-6 flex justify-between gap-4 items-center hand-top-container pb-7 md:pb-8">
                <div className="relative flex gap-2 font-press-start">
                    <input
                        type="text"
                        id="search"
                        className={`${styles['snes-input']} w-full md:w-auto`}
                        autoComplete="off"
                        style={inputBorderStyle}
                        placeholder='Search Cards'
                        value={searchString}
                        onChange={(e) => setSearchString(e.target.value)}
                        maxLength={12}
                    />
                    {searchString !== "" ? (
                        <button
                            onClick={() => setSearchString('')}
                            className="px-1 cursor-pointer absolute right-3 top-1/2 -translate-y-1/2 text-neutral-600 hover:text-neutral-900 text-lg leading-none"
                            aria-label="Clear search"
                        >
                            <svg className="w-7 h-7 stroke-neutral-600 hover:stroke-neutral-900 fill-neutral-600 hover:fill-neutral-900" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g> <path d="M5 5h2v2H5V5zm4 4H7V7h2v2zm2 2H9V9h2v2zm2 0h-2v2H9v2H7v2H5v2h2v-2h2v-2h2v-2h2v2h2v2h2v2h2v-2h-2v-2h-2v-2h-2v-2zm2-2v2h-2V9h2zm2-2v2h-2V7h2zm0 0V5h2v2h-2z"></path> </g></svg>
                        </button>
                    ) : (
                        <button
                            onClick={() => setSortByStrength(!sortByStrength)}
                            aria-label="Toggle sort"
                            className="px-1 cursor-pointer absolute right-3 top-1/2 -translate-y-1/2 text-neutral-600 hover:text-neutral-900 text-lg leading-none"
                        >
                            <svg className={`w-7 h-7 transition-colors stroke-neutral-900 fill-neutral-900 ${sortByStrength ? 'opacity-100' : 'opacity-60 hover:opacity-100'}`} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g strokeWidth="0"></g><g strokeLinecap="round" strokeLinejoin="round"></g><g> <path d="M8 20H6V8H4V6h2V4h2v2h2v2H8v12zm2-12v2h2V8h-2zM4 8v2H2V8h2zm14-4h-2v12h-2v-2h-2v2h2v2h2v2h2v-2h2v-2h2v-2h-2v2h-2V4z"></path> </g></svg>
                        </button>
                    )}
                </div>
                <h1 className="hidden md:block text-right header-text text-xl lg:text-2xl text-hop">
                    {helperTextChars.map((char, index) => (<span key={index} style={{
                        animationDelay: `${(index + 1) * 50}ms`
                    }}>{char}</span>))}

                </h1>
            </div>
            <div className="relative grow md:flex overflow-y-auto">
                <div className={`h-full relative hide-scrollbar p-2 pb-[52px] md:p-4 md:pb-4 ${isLoadingCollection ? 'overflow-y-hidden' : 'overflow-y-auto'}`}>
                    <div className="grid grid-cols-[repeat(4,82px)] place-content-center md:grid-cols-[repeat(4,124px)] auto-rows-min gap-1 md:gap-4">
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
                {isMobile && (
                    <div className='absolute bottom-0 bg-black/50 border-t-4 border-black w-full'>
                        <div className='font-press-start text-white text-sm py-2.5 px-3 gap-2 flex justify-between'>
                            <span>Show Profiles?</span>
                            <div className='flex gap-2'>
                                <label>
                                    <input type="radio" className={`${styles['nes-radio']} ${styles['is-dark']}`} name="answer" checked={showProfilesOnMobile} onChange={() => setShowProfilesOnMobile(true)} />
                                    <span>Yes</span>
                                </label>

                                <label>
                                    <input type="radio" className={`${styles['nes-radio']} ${styles['is-dark']}`} name="answer" checked={!showProfilesOnMobile} onChange={() => setShowProfilesOnMobile(false)} />
                                    <span>No</span>
                                </label>
                            </div>
                        </div>
                    </div>
                )}

                {(!isMobile || showProfilesOnMobile) && (
                    <Profile
                        playerHand={playerHand}
                        lastSelectedHand={lastSelectedHand}
                        setPlayerHand={setPlayerHand}
                        lastPokemonCardSelected={lastPokemonCardSelected}
                        isOpen={showProfile && !showConfirm}
                        onClose={isMobile ? handleCloseProfile : undefined}
                    />
                )}

            </div>
            {showConfirm && (
                <div className="absolute inset-0 bg-black/60 pointer-events-none md:pointer-events-auto" />
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
                {playerHand.every(card => card === null) && showHelp && (
                    <Help customClass="fade-in-b !hidden md:!block !absolute !-top-16 !left-80" text="Add cards to your hand!" />
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