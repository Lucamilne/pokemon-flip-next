import { useEffect, useState, useMemo } from 'react';
import { getPokemonData, getPokemonSpeciesData } from '@/utils/pokeApi';
import { useAuth } from '@/contexts/AuthContext';
import { allPokemonNames, fetchSingleTypeCards, fetchSecretCards } from "@/utils/cardHelpers.js";

import Loader from "@/components/Loader/Loader.js";
import styles from "./retro.module.css";

export default function Profile({ playerHand, setPlayerHand, lastPokemonCardSelected }) {
    const { user, signInWithGoogle, addAllCards, resetToStarters, collectionCount } = useAuth();
    const [debugMode, setDebugMode] = useState(false);

    useEffect(() => {
        // Enable debug mode in development or when ?debug=true is in URL
        if (typeof window !== 'undefined') {
            const params = new URLSearchParams(window.location.search);
            const hasDebugParam = params.get('debug') === 'true';
            setDebugMode(hasDebugParam || import.meta.env.DEV);
        }
    }, []);

    const [pokemonData, setPokemonData] = useState(null);
    const [evolutionChain, setEvolutionChain] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

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
        return types.map((type) => {
            return (
                <span
                    key={type}
                    className="text-white py-1 px-3 mr-2"
                    style={{ backgroundColor: `var(--color-${type}-500)` }}
                >
                    {capitaliseFirstLetter(type)}
                </span>
            );
        });
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

                if (import.meta.env.PROD) {
                    const pokemonCry = new Audio(combinedData.cries.legacy);
                    pokemonCry.volume = 0.5;
                    pokemonCry.addEventListener('error', (error) => {
                        console.error(`Failed to play ${combinedData.name} cry: `, error)
                    })
                    pokemonCry.play();
                }
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

    const setRandomThemedPlayerHand = (themedFunction) => {
        try {
            const array = themedFunction(true);
            const shuffled = [...array].sort(() => Math.random() - 0.5);
            const hand = shuffled.slice(0, 5);
            setPlayerHand(hand);
        } catch (error) {
            console.error('Error setting themed hand:', error);
        }
    };

    const EvolutionChain = ({ chain }) => {
        if (!chain) return null;

        const baseImgURL = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/";

        // No evolution
        if (!chain.evolves_to || chain.evolves_to.length === 0) {
            return <div className="text-sm"><span className='capitalize'>{chain.species.name}</span> does not evolve.</div>;
        }

        // Render evolution rows
        const renderEvolution = (basePokemon, evolvedPokemon) => (
            <div key={`${basePokemon.species.name}-${evolvedPokemon.species.name}`} className="grid grid-cols-3 justify-between items-center gap-2 mb-2">
                <div className="flex flex-col items-center">
                    <img
                        alt={basePokemon.species.name}
                        src={`${baseImgURL}${getIdFromUrl(basePokemon.species.url)}.png`}
                        className="w-16 h-16"
                    />
                    <span className="text-xs capitalize">{basePokemon.species.name}</span>
                </div>
                <div className='flex justify-center'>
                    <div className="arrow" />
                </div>
                <div className="flex flex-col items-center">
                    <img
                        alt={evolvedPokemon.species.name}
                        src={`${baseImgURL}${getIdFromUrl(evolvedPokemon.species.url)}.png`}
                        className="w-16 h-16"
                    />
                    <span className="text-xs capitalize">{evolvedPokemon.species.name}</span>
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
        const cardPowerLevelColour = () => {
            if (statTier < 3) return 'is-error';
            if (statTier < 7) return 'is-warning';
            return 'is-success';
        }

        const powerLevelColour = useMemo(() => {
            if (statTier < 3) return 'is-error';
            if (statTier < 7) return 'is-warning';
            return 'is-success';
        }, [statTier]);

        return (
            <div className='fade-in h-full p-8 overflow-y-auto hide-scrollbar'>
                <div>
                    <h3 className="mb-2">
                        <span className="capitalize text-lg font-bold mr-4">{pokemonData?.name}</span>
                        <span>#{pokemonData?.id}</span>
                    </h3>
                    <TypeList types={pokemonData?.types?.map(t => t.type.name)} />
                </div>
                <div>
                    <h3 className='text-xs mt-4 mb-2 md:text-base'>
                        Card Power Level
                    </h3>
                    <progress className={`${styles['nes-progress']} ${styles[powerLevelColour]}`} value={statTier} max="10" />
                </div>
                <hr className="border-2 border-black my-3" />
                <div>
                    <h3 className='mb-2'>
                        {pokemonData.genera?.find(g => g.language.name === 'en')?.genus || 'Unknown Pokémon'}
                    </h3>
                    <p className="text-sm">
                        {pokemonData.flavor_text_entries?.find(entry => entry.language.name === 'en')?.flavor_text.replace(/\f/g, ' ') || 'No description available.'}
                    </p>
                </div>
                <hr className="border-2 border-black my-3" />
                <div>
                    <h3 className='mb-2'>Pokédex Data</h3>
                    <ul className="text-sm">
                        <li className="flex justify-between">Height:<span>{(pokemonData.height / 10).toFixed(1)}m</span></li>
                        <li className="flex justify-between">Weight:<span>{(pokemonData.weight / 10).toFixed(1)}kg</span></li>
                        <li className="flex justify-between">Colour:<span className="capitalize">{pokemonData.color?.name || 'Unknown'}</span></li>
                        <li className="flex justify-between">Shape:<span className="capitalize">{pokemonData.shape?.name || 'Unknown'}</span></li>
                        <li className="flex justify-between">Growth rate:<span className="capitalize">{pokemonData.growth_rate?.name.replace('-', ' ') || 'Unknown'}</span></li>
                        <li className="flex justify-between">Habitat:<span className="capitalize">{pokemonData.habitat?.name || 'Unknown'}</span></li>
                    </ul>
                </div>
                <hr className="border-2 border-black my-3" />
                {evolutionChain && (
                    <div>
                        <h3 className='mb-2'>Evolution Chain</h3>
                        <EvolutionChain chain={evolutionChain} />
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className='relative flex-1 default-tile border-x-4 border-black font-press-start p-2'>
            {playerHand.every(card => card === null) ? (
                <div className="min-w-full h-full flex flex-col gap-8 justify-between p-8 overflow-y-auto hide-scrollbar">
                    <div className='font-press-start grid grid-cols-1 gap-8'>
                        <h2 className='font-bold text-2xl text-center'>Your Collection</h2>
                        <p>
                            Create your own hand by selecting from your pokemon library on the left!
                        </p>
                        <p>
                            Your Pokédex has {collectionCount}/{allPokemonNames.length} entries.
                        </p>
                        {!user && (
                            <p>
                                <button className="cursor-pointer text-blue-500" onClick={signInWithGoogle}>Sign in</button> to backup and sync your collection across all your devices!
                            </p>
                        )}
                        {debugMode && (
                            <div className='ml-5'>
                                <div className="relative group">
                                    <div className="arrow absolute -left-2 top-1 -translate-y-1/2 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 group-has-[:disabled]:!opacity-0 transition-opacity" />
                                    <button onClick={() => setRandomThemedPlayerHand(fetchSecretCards)} className="disabled:opacity-30 cursor-pointer">Debug: 秘密</button>
                                </div>
                                <div className="relative group">
                                    <div className="arrow absolute -left-2 top-1 -translate-y-1/2 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 group-has-[:disabled]:!opacity-0 transition-opacity" />
                                    <button onClick={() => addAllCards()} className="disabled:opacity-30 cursor-pointer">Debug: Add all cards</button>
                                </div>
                                <div className="relative group">
                                    <div className="arrow absolute -left-2 top-1 -translate-y-1/2 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 group-has-[:disabled]:!opacity-0 transition-opacity" />
                                    <button onClick={() => resetToStarters()} className="disabled:opacity-30 cursor-pointer">Debug: Reset Collection</button>
                                </div>
                            </div>
                        )}
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
    );
}