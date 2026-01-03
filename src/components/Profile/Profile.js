import { useEffect, useState, useMemo, useRef, useLayoutEffect } from 'react';
import { getPokemonData, getPokemonSpeciesData } from '@/utils/pokeApi';
import { useAuth } from '@/contexts/AuthContext';
import { useGameContext } from '@/contexts/GameContext';
import { allPokemonNames, fetchRandomCardsFromUserCollection, fetchSecretCards } from "@/utils/cardHelpers.js";
import { TYPES_PER_CARD } from '@/constants/index.js';

import Loader from "@/components/Loader/Loader.js";
import styles from "./retro.module.css";
import gameData from '@/data/game-data.json';

const { cards, abilities } = gameData;

export default function Profile({ playerHand, lastSelectedHand, setPlayerHand, lastPokemonCardSelected, onClose }) {
    const { user, hasCard, signInWithGoogle, addAllCards, resetToStarters, collectionCount, userCollection } = useAuth();
    const [debugMode, setDebugMode] = useState(false);
    const scrollContainerRef = useRef(null);
    const [showScrollIndicator, setShowScrollIndicator] = useState(false);
    const [pokemonData, setPokemonData] = useState(null);
    const [evolutionChain, setEvolutionChain] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Enable debug mode in development or when ?debug=true is in URL
        if (typeof window !== 'undefined') {
            const params = new URLSearchParams(window.location.search);
            const hasDebugParam = params.get('debug') === 'true';
            setDebugMode(hasDebugParam || import.meta.env.DEV);
        }
    }, []);

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

    // Set up scroll listener once
    useEffect(() => {
        const container = scrollContainerRef.current;
        if (!container) return;

        container.addEventListener('scroll', checkScrollIndicator);

        return () => {
            container.removeEventListener('scroll', checkScrollIndicator);
        };
    }, []);

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
                    const evolutionResponse = await fetch(speciesData.evolution_chain.url);
                    const evolutionData = await evolutionResponse.json();
                    setEvolutionChain(evolutionData.chain);
                }

                setPokemonData(combinedData);

                // if (import.meta.env.PROD) {
                //     const pokemonCry = new Audio(combinedData.cries.legacy);
                //     pokemonCry.volume = 0.5;
                //     pokemonCry.addEventListener('error', (error) => {
                //         console.error(`Failed to play ${combinedData.name} cry: `, error)
                //     })
                //     pokemonCry.play();
                // }
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

        const powerLevelColour = useMemo(() => {
            if (statTier < 3) return 'is-error';
            if (statTier < 7) return 'is-warning';
            return 'is-success';
        }, [statTier]);

        return (
            <div className='h-full'>
                <div className='flex flex-col gap-2 md:flex-row justify-between md:items-center'>
                    <h3 className="text-xs md:text-lg font-bold">
                        <span className="capitalize mr-1 md:mr-4">{pokemonData?.name}</span>
                        <span className='hidden md:inline'>#{pokemonData?.id}</span>
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
                    <div className='mr-2'>
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
                        <ul className="text-[9px] md:text-sm grid grid-cols-[1fr_auto] gap-x-2 max-w-36 md:max-w-full">
                            <span className="truncate">Height:</span>
                            <span className="shrink-0">{(pokemonData.height / 10).toFixed(1)}m</span>

                            <span className="truncate">Weight:</span>
                            <span className="shrink-0">{(pokemonData.weight / 10).toFixed(1)}kg</span>

                            <span className="truncate">Colour:</span>
                            <span className="capitalize shrink-0">{pokemonData.color?.name || 'Unknown'}</span>

                            <span className="truncate">Morph:</span>
                            <span className="capitalize shrink-0">{pokemonData.shape?.name || 'Unknown'}</span>
                        </ul>
                    </div>
                </div>

                <Divider />
                <div>
                    {evolutionChain && (
                        <div className='pb-3 md:pb-4'>
                            <Header>Evolutions</Header>
                            <EvolutionChain chain={evolutionChain} />
                        </div>
                    )}
                </div>
            </div>
        );
    };

    const setLastSelectedHand = () => {
        const filteredHand = lastSelectedHand.map(pokemonCard => {
            if (!pokemonCard) return null;

            const isOwned = hasCard(pokemonCard.name) || pokemonCard.starter;
            return isOwned ? pokemonCard : null;
        });

        setPlayerHand(filteredHand);
    };

    return (
        <div className='flex-1 tooltip border-2 md:border-4 border-black font-press-start p-1 h-auto shadow-md ml-2 my-2 md:my-4 md:mr-4'>
            <div ref={scrollContainerRef} className="relative h-full overflow-y-auto hide-scrollbar p-3 md:p-8">
                {playerHand.every(card => card === null) || playerHand.every(card => card !== null) ? (
                    <div className="size-full">
                        <div className='font-press-start grid grid-cols-1 gap-3 md:gap-8 text-[9px] md:text-base'>
                            <h2 className='font-bold text-xs md:text-xl text-center w-full'>Your Collection</h2>
                            <p>
                                Create your own hand by selecting from your pokemon library on the <span className="md:hidden">right</span><span className="hidden md:inline">left</span>!
                            </p>
                            {!user && false && (
                                <p>
                                    <button className="cursor-pointer text-blue-500" onClick={signInWithGoogle}>Sign in</button> to backup and sync your collection across all your devices!
                                </p>
                            )}
                            <p>
                                As the app is still in development, you have access to a select number of debug functions:
                            </p>

                            <div className='text-[9px] md:text-base text-left ml-3 md:ml-6'>
                                <div className="relative group">
                                    <div className="arrow absolute scale-50 md:scale-100 -left-4 md:-left-6 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 group-has-[:disabled]:!opacity-0 transition-opacity" />
                                    <button onClick={() => addAllCards()} className="disabled:opacity-30 cursor-pointer text-left w-full truncate">Add all cards</button>
                                </div>
                                <div className="relative group">
                                    <div className="arrow absolute scale-50 md:scale-100 -left-4 md:-left-6 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 group-has-[:disabled]:!opacity-0 transition-opacity" />
                                    <button onClick={() => resetToStarters()} className="disabled:opacity-30 cursor-pointer text-left w-full truncate">Reset cards</button>
                                </div>
                                <div className="relative group">
                                    <div className="arrow absolute scale-50 md:scale-100 -left-4 md:-left-6 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 group-has-[:disabled]:!opacity-0 transition-opacity" />
                                    <button onClick={() => setPlayerHand(fetchRandomCardsFromUserCollection(userCollection))} className="disabled:opacity-30 cursor-pointer text-left w-full truncate">Random Hand</button>
                                </div>
                                {lastSelectedHand && lastSelectedHand.length > 0 && (
                                    <div className="relative group">
                                        <div className="arrow absolute scale-50 md:scale-100 -left-4 md:-left-6 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 group-has-[:disabled]:!opacity-0 transition-opacity" />
                                        <button onClick={setLastSelectedHand} className="disabled:opacity-30 cursor-pointer whitespace-nowrap text-left w-full truncate">Select Last Played Hand</button>
                                    </div>
                                )}
                            </div>
                            <p>
                                Your Pokédex has {collectionCount}/{allPokemonNames.length} entries.
                            </p>
                        </div>
                    </div>
                ) : (
                    isLoading ? (
                        <Loader />
                    ) : (
                        <ProfileContent />
                    )
                )}
            </div>
            {showScrollIndicator && <div className="arrow absolute rotate-90 bottom-1.5 right-1.5 md:bottom-4 md:right-4 blink" />}
        </div>
    );
}