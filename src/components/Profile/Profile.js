import { useEffect, useState, useRef, useLayoutEffect } from 'react';
import { getPokemonData, getPokemonSpeciesData } from '@/utils/pokeApi';
import { useAuth } from '@/contexts/AuthContext';
import { useGameContext } from '@/contexts/GameContext';
import { allPokemonNames, fetchRandomCardsFromUserCollection, fetchSecretCards } from "@/utils/cardHelpers.js";
import { TYPES_PER_CARD } from '@/constants/index.js';

import Loader from "@/components/Loader/Loader.js";
import styles from "@/retro.module.css";
import gameData from '@/data/game-data.json';

const { cards, abilities } = gameData;

const isDevelopment = process.env.NODE_ENV === 'development';

export default function Profile({ playerHand, lastSelectedHand, setPlayerHand, lastPokemonCardSelected, isOpen, onClose }) {
    const { user, hasCard, signInWithGoogle, signOut, addAllCards, resetToStarters, collectionCount, userCollection } = useAuth();
    const { isMobile } = useGameContext();

    const scrollContainerRef = useRef(null);
    const [showScrollIndicator, setShowScrollIndicator] = useState(false);
    const [pokemonData, setPokemonData] = useState(null);
    const [evolutionChain, setEvolutionChain] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    // Show debug buttons in development mode or when debug=true is in URL
    const showDebugButtons = isDevelopment || (typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('debug') === 'true');

    const checkScrollIndicator = () => {
        if (!scrollContainerRef.current) return;

        const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;
        const hasOverflow = scrollHeight > clientHeight;

        // Hide indicator as soon as user scrolls
        if (scrollTop > 0) {
            setShowScrollIndicator(false);
        } else {
            setShowScrollIndicator(hasOverflow);
        }
    };

    // Check after layout changes (when content switches)
    useLayoutEffect(() => {
        checkScrollIndicator();
    }, [playerHand, isLoading]);

    // Set up scroll listener - re-attach when isOpen changes
    useEffect(() => {
        const container = scrollContainerRef.current;
        if (!container) return;

        container.addEventListener('scroll', checkScrollIndicator);
        checkScrollIndicator(); // Check immediately when container becomes available

        return () => {
            container.removeEventListener('scroll', checkScrollIndicator);
        };
    }, [isOpen, checkScrollIndicator]);

    const capitaliseFirstLetter = (val) => {
        return String(val).charAt(0).toUpperCase() + String(val).slice(1);
    }

    const getStatWeightTierByPokemon = (pokemonData) => {
        const sumBaseStats = pokemonData.stats.reduce((sum, stat) => sum + stat.base_stat, 0);

        const minStat = 195;
        const maxStat = 680;
        const segmentSize = 48.5;

        // Clamp to valid range
        if (sumBaseStats < minStat) return 1;
        if (sumBaseStats >= maxStat) return 10;

        return Math.floor((sumBaseStats - minStat) / segmentSize) + 1;
    };

    const TypeList = ({ types = [] }) => {
        return (
            <div className='flex gap-2'>
                {types.slice(0, TYPES_PER_CARD).map(type => (
                    <span
                        key={type}
                        className="text-white text-[9px] md:text-base py-1 px-3"
                        style={{ backgroundColor: `var(--color-${type}-500)` }}
                    >
                        {capitaliseFirstLetter(type)}
                    </span>
                ))}
            </div>
        );
    }

    useEffect(() => {
        setPokemonData(null);
        setEvolutionChain(null);

        if (!lastPokemonCardSelected) return;

        const fetchPokemonData = async () => {
            setIsLoading(true);
            setError(null);

            try {
                const [pokemonData, speciesData] = await Promise.all([
                    getPokemonData(lastPokemonCardSelected.name),
                    getPokemonSpeciesData(lastPokemonCardSelected.name)
                ]);

                const combinedData = { ...pokemonData, ...speciesData };

                // Fetch evolution chain if available
                if (speciesData.evolution_chain?.url) {
                    try {
                        const evolutionResponse = await fetch(speciesData.evolution_chain.url);
                        const evolutionData = await evolutionResponse.json();
                        setEvolutionChain(evolutionData.chain);
                    } catch (evolutionError) {
                        console.error('Failed to fetch evolution chain:', evolutionError);
                    }
                }

                setPokemonData(combinedData);
            } catch (error) {
                console.error('Failed to fetch pokemon data:', error);
                setError(error.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchPokemonData();
    }, [lastPokemonCardSelected])

    const getIdFromUrl = (url) => {
        return url.split('/').filter(Boolean).pop();
    };

    const Divider = () => {
        return <hr className="border md:border-2 border-black my-3 md:my-4" />
    }

    const Header = ({ children }) => {
        return (
            <h3 className='text-xs mb-3 md:mb-4 md:text-base'>
                {children}
            </h3>
        )
    }

    const EvolutionChain = ({ chain }) => {
        if (!chain) return null;

        const baseImgURL = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/";

        // No evolution
        if (!chain.evolves_to || chain.evolves_to.length === 0) {
            return <div className="text-[9px] md:text-sm"><span className='capitalize'>{chain.species.name}</span> does not evolve.</div>;
        }

        // Render evolution rows
        const renderEvolution = (basePokemon, evolvedPokemon) => (
            <div key={`${basePokemon.species.name}-${evolvedPokemon.species.name}`} className="grid grid-cols-[1fr_auto_1fr] justify-between items-center mb-2">
                <div className="flex flex-col items-center">
                    <img
                        alt={basePokemon.species.name}
                        src={`${baseImgURL}${getIdFromUrl(basePokemon.species.url)}.png`}
                        className="size-16"
                    />
                    <span className="hidden md:block text-xs capitalize">{basePokemon.species.name}</span>
                </div>
                <div className='flex justify-center'>
                    <div className="arrow-relative" />
                </div>
                <div className="flex flex-col items-center">
                    <img
                        alt={evolvedPokemon.species.name}
                        src={`${baseImgURL}${getIdFromUrl(evolvedPokemon.species.url)}.png`}
                        className="size-16"
                    />
                    <span className="hidden md:block text-xs capitalize">{evolvedPokemon.species.name}</span>
                </div>
            </div>
        );

        return (
            <div className="text-sm">
                {chain.evolves_to.map(evolution => (
                    <div key={evolution.species.name}>
                        {renderEvolution(chain, evolution)}
                        {evolution.evolves_to?.map(secondEvolution =>
                            renderEvolution(evolution, secondEvolution)
                        )}
                    </div>
                ))}
            </div>
        );
    };

    const ProfileContent = () => {
        if (!pokemonData) return null;

        const statTier = getStatWeightTierByPokemon(pokemonData);
        const ability = abilities[cards[pokemonData.name]?.ability];

        const getPowerLevelColour = (tier) => {
            if (tier < 3) return 'is-error';
            if (tier < 7) return 'is-warning';
            return 'is-success';
        };
        const powerLevelColour = getPowerLevelColour(statTier);

        return (
            <div className='size-full md:py-8'>
                <div className='grid grid-cols-1 gap-2'>
                    <h3 className="text-xs md:text-lg font-bold">
                        <span className="capitalize mr-1 md:mr-4">{pokemonData?.name}</span>
                        <span>#{pokemonData?.id}</span>
                    </h3>
                    <TypeList types={pokemonData?.types?.map(t => t.type.name)} />
                </div>
                <Divider />
                <div className='grid grid-cols-1 gap-4'>
                    {ability && (
                        <div>
                            <Header>{ability?.name}</Header>
                            <div>
                                <p className="text-[9px] md:text-sm">
                                    {ability?.description}.
                                </p>
                            </div>
                        </div>
                    )}
                    <div className='mr-3'>
                        <progress className={`${styles['nes-progress']} ${styles[powerLevelColour]} md:h-8`} value={statTier} max="10" />
                    </div>
                </div>
                <Divider />
                <div className='grid grid-cols-1 gap-4 mt-4'>
                    <div>
                        <Header>
                            {pokemonData.genera?.find(g => g.language.name === 'en')?.genus || 'Unknown Pokémon'}
                        </Header>
                        <p className="text-[9px] md:text-sm">
                            {pokemonData.flavor_text_entries?.find(entry => entry.language.name === 'en')?.flavor_text.replace(/\f/g, ' ') || 'No description available.'}
                        </p>
                    </div>
                    <div>
                        <Header>Pokédex Data</Header>
                        <div className="text-[9px] md:text-sm grid grid-cols-[1fr_auto] gap-x-2">
                            <span className="truncate">Height:</span>
                            <span className="shrink-0">{(pokemonData.height / 10).toFixed(1)}m</span>

                            <span className="truncate">Weight:</span>
                            <span className="shrink-0">{(pokemonData.weight / 10).toFixed(1)}kg</span>

                            <span className="truncate">Colour:</span>
                            <span className="capitalize shrink-0">{pokemonData.color?.name || 'Unknown'}</span>

                            <span className="truncate">Morph:</span>
                            <span className="capitalize shrink-0">{pokemonData.shape?.name || 'Unknown'}</span>
                        </div>
                    </div>
                </div>

                <Divider />
                <div>
                    {evolutionChain && (
                        <div className='md:pb-8'>
                            <Header>Evolutions</Header>
                            <EvolutionChain chain={evolutionChain} />
                        </div>
                    )}
                </div>
            </div>
        );
    };

    const restoreLastSelectedHand = () => {
        const filteredHand = lastSelectedHand.map(pokemonCard => {
            if (!pokemonCard) return null;

            const isOwned = hasCard(pokemonCard.name) || pokemonCard.starter;
            return isOwned ? pokemonCard : null;
        });

        setPlayerHand(filteredHand);
    };

    const content = (
        <div className='flex-1 mx-auto max-w-4xl tooltip border-4 border-black font-press-start p-4 md:p-1 h-full md:h-auto shadow-md md:mx-0 md:my-4 md:mr-4 md:px-8'>
            <div ref={scrollContainerRef} className="relative h-full overflow-y-auto hide-scrollbar">
                {playerHand.every(card => card === null) || !lastPokemonCardSelected ? (
                    <div className='text-center md:text-left font-press-start flex flex-col justify-center md:justify-start gap-4 md:gap-8 text-xs md:text-base md:py-8'>
                        <h2 className='font-bold text-base md:text-xl w-full'>Your Collection</h2>
                        <p>
                            Create your own hand by selecting up to 5 Pokémon from your library!
                        </p>
                        <div className='border-4 border-black p-3 md:p-4 bg-white'>
                            <div className='flex justify-between items-center mb-2'>
                                <span className='font-bold'>POKÉDEX</span>
                                <span className='font-bold'>{collectionCount}/{allPokemonNames.length}</span>
                            </div>
                            <progress
                                className={`${styles['nes-progress']} ${collectionCount / allPokemonNames.length >= 0.75 ? styles['is-success'] :
                                    collectionCount / allPokemonNames.length >= 0.5 ? styles['is-primary'] :
                                        collectionCount / allPokemonNames.length >= 0.25 ? styles['is-warning'] :
                                            styles['is-error']
                                    }`}
                                value={collectionCount}
                                max={allPokemonNames.length}
                            />
                            <div className='text-[8px] md:text-xs mt-1 opacity-75'>
                                {Math.round((collectionCount / allPokemonNames.length) * 100)}% Complete
                            </div>
                        </div>
                        <div className='grid grid-cols-1 gap-2'>
                            {user ? (
                                <button className={`${styles['nes-btn']} ${styles['is-error']} cursor-pointer`} onClick={signOut}>Go Offline</button>
                            ) : (
                                <button className={`${styles['nes-btn']} ${styles['is-success']} cursor-pointer`} onClick={signInWithGoogle}>Save Progress</button>
                            )}
                            <button onClick={() => setPlayerHand(fetchRandomCardsFromUserCollection(userCollection))} className={`${styles['nes-btn']} cursor-pointer`}>Random Hand</button>
                            <button
                                onClick={restoreLastSelectedHand}
                                disabled={!lastSelectedHand || lastSelectedHand.length === 0}
                                className={`${styles['nes-btn']} ${!lastSelectedHand || lastSelectedHand.length === 0 ? styles['is-disabled'] : 'cursor-pointer'}`}
                            >
                                Last Played Hand
                            </button>
                            {showDebugButtons && (
                                <>
                                    <h3 className="my-4 md:my-8">Debug functions:</h3>
                                    <button onClick={() => addAllCards()} className={`${styles['nes-btn']} ${styles['is-warning']} cursor-pointer`}>Add all cards</button>
                                    <button onClick={() => resetToStarters()} className={`${styles['nes-btn']} ${styles['is-error']} cursor-pointer`}>Reset cards</button>
                                    <button onClick={() => setPlayerHand(fetchSecretCards())} className={`${styles['nes-btn']} ${styles['is-success']} cursor-pointer`}>Secret Cards</button>

                                </>
                            )}
                        </div>
                    </div>
                ) : (
                    isLoading ? (
                        <div className="h-full relative">
                            <Loader />
                        </div>
                    ) : (
                        <ProfileContent />
                    )
                )}
            </div>
            {showScrollIndicator && <div className="arrow absolute rotate-90 bottom-3 right-3 md:bottom-4 md:right-4 blink" />}
        </div >
    );

    if (!isMobile) return content;

    // Wrap in modal only on mobile
    return (
        <>
            {isOpen && (
                <div className="absolute inset-0 bg-black/50 z-50 flex items-center justify-center">
                    <div className="relative p-2 size-full max-w-4xl overflow-hidden" onClick={(e) => { e.stopPropagation() }}>
                        {content}
                    </div>
                    <button onClick={onClose} className='cursor-pointer text-neutral-600 hover:text-neutral-900 leading-none w-8 h-8 flex justify-center items-center absolute top-4 right-4 font-press-start leading-none'>
                        <span>X</span>
                    </button>
                </div>
            )}
        </>
    );
}