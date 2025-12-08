import { useEffect, useState, useMemo } from 'react';
import { getPokemonData, getPokemonSpeciesData } from '@/utils/pokeApi';
import Loader from "@/components/Loader/Loader.js";
import * as cardHelpers from '@/utils/cardHelpers.js';
import gameData from '@/data/game-data.json';

export default function Profile({ playerHand, setPlayerHand, lastPokemonCardSelected }) {
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

    function capitaliseFirstLetter(val) {
        return String(val).charAt(0).toUpperCase() + String(val).slice(1);
    }

    const TypeList = ({ types = [] }) => {
        return types.map((type) => {
            return (
                <span
                    key={type}
                    className="text-white text-[10px] md:text-base py-1 px-3 mr-2"
                    style={{ backgroundColor: `var(--color-${type}-500)` }}
                >
                    {capitaliseFirstLetter(type)}
                </span>
            );
        });
    }

    useEffect(() => {
        if (!lastPokemonCardSelected) return;

        const fetchPokemonData = async () => {
            setPokemonData(null);
            setEvolutionChain(null);
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

    const setRandomPlayerHandByType = (type) => {
        try {
            const array = cardHelpers.fetchSingleTypeCards(type, true);
            const shuffled = [...array].sort(() => Math.random() - 0.5);
            const hand = shuffled.slice(0, 5);
            setPlayerHand(hand);
        } catch (error) {
            console.error('Error setting themed hand:', error);
        }
    }

    const EvolutionChain = ({ chain }) => {
        if (!chain) return null;

        const baseImgURL = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/";

        // No evolution
        if (!chain.evolves_to || chain.evolves_to.length === 0) {
            return <div className="text-sm"><span className='capitalize'>{chain.species.name}</span> does not evolve.</div>;
        }

        // Render evolution rows
        const renderEvolution = (basePokemon, evolvedPokemon) => (
            <div key={`${basePokemon.species.name}-${evolvedPokemon.species.name}`} className="grid grid-cols-[1fr_auto_1fr] justify-between items-center gap-2 mb-2">
                <div className="flex flex-col items-center">
                    <img
                        alt={basePokemon.species.name}
                        src={`${baseImgURL}${getIdFromUrl(basePokemon.species.url)}.png`}
                        className="w-16 h-16"
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
                        className="w-16 h-16"
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

        return (
            <div className='h-full p-3 md:p-8 overflow-y-auto hide-scrollbar'>
                <div>
                    <h3 className="md:mb-2 text-xs md:text-lg font-bold ">
                        <span className="capitalize mr-1 md:mr-4">{lastPokemonCardSelected?.name}</span>
                        <span>#{lastPokemonCardSelected?.id}</span>
                    </h3>
                    <TypeList types={lastPokemonCardSelected?.types} />
                </div>
                <hr className="border-2 border-black my-3" />
                <div>
                    <h3 className='text-xs mb-2 md:text-base'>
                        {pokemonData.genera?.find(g => g.language.name === 'en')?.genus || 'Unknown Pokémon'}
                    </h3>
                    <p className="text-[10px] md:text-sm">
                        {pokemonData.flavor_text_entries?.find(entry => entry.language.name === 'en')?.flavor_text.replace(/\f/g, ' ') || 'No description available.'}
                    </p>
                </div>
                <hr className="border-2 border-black my-3" />
                <div>
                    <h3 className='text-xs mb-2 md:text-base'>Pokédex Data</h3>
                    <ul className="text-[10px] md:text-sm">
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
                        <h3 className='text-xs mb-2 md:text-base'>Evolutions</h3>
                        <EvolutionChain chain={evolutionChain} />
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className='relative flex-1 default-tile border-x-4 border-black font-press-start p-2'>
            {playerHand.every(card => card === null) ? (
                <div className="min-w-full h-full flex flex-col gap-3 md:gap-8 justify-between p-3 md:p-8 overflow-y-auto hide-scrollbar">
                    <div className='font-press-start grid grid-cols-1 gap-3 md:gap-8'>
                        <h2 className='font-bold text-sm md:text-2xl text-center'>Themed hands</h2>
                        <p className='text-[10px] md:text-base'>For the purposes of testing, all pokemon are made available to you.</p>
                        <p className='text-[10px] md:text-base'>
                            Create your own hand by selecting from the full pokemon library on the left, or choose a theme below:
                        </p>
                        <div className='text-[8px] md:text-base md:ml-5'>
                            <div className="relative group">
                                <div className="arrow absolute -left-4 top-1 -translate-y-1/2 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 group-has-[:disabled]:!opacity-0 transition-opacity" />
                                <button onClick={() => setRandomThemedPlayerHand(cardHelpers.allocateRandomCards)} className="disabled:opacity-30 cursor-pointer">Random</button>
                            </div>
                            <div className="relative group">
                                <div className="arrow absolute -left-4 top-1 -translate-y-1/2 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 group-has-[:disabled]:!opacity-0 transition-opacity" />
                                <button onClick={() => setRandomThemedPlayerHand(cardHelpers.fetchEarlyGameCards)} className="disabled:opacity-30 cursor-pointer">Early Game Cards</button>
                            </div>
                            <div className="relative group">
                                <div className="arrow absolute -left-4 top-1 -translate-y-1/2 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 group-has-[:disabled]:!opacity-0 transition-opacity" />
                                <button onClick={() => setRandomThemedPlayerHand(cardHelpers.fetchMidGameCards)} className="disabled:opacity-30 cursor-pointer">Average Cards</button>
                            </div>

                            <div className="relative group">
                                <div className="arrow absolute -left-4 top-1 -translate-y-1/2 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 group-has-[:disabled]:!opacity-0 transition-opacity" />
                                <button onClick={() => setRandomThemedPlayerHand(cardHelpers.fetchStrongCards)} className="disabled:opacity-30 cursor-pointer">Strong Cards</button>
                            </div>
                            <div className="relative group">
                                <div className="arrow absolute -left-4 top-1 -translate-y-1/2 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 group-has-[:disabled]:!opacity-0 transition-opacity" />
                                <button onClick={() => setRandomThemedPlayerHand(cardHelpers.fetchMonoTypeCards)} className="disabled:opacity-30 cursor-pointer">Single Types Only</button>
                            </div>
                            <div className="relative group">
                                <div className="arrow absolute -left-4 top-1 -translate-y-1/2 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 group-has-[:disabled]:!opacity-0 transition-opacity" />
                                <button onClick={() => setRandomThemedPlayerHand(cardHelpers.fetchNidoFamilyCards)} className="disabled:opacity-30 cursor-pointer">The Family</button>
                            </div>
                            <div className="relative group">
                                <div className="arrow absolute -left-4 top-1 -translate-y-1/2 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 group-has-[:disabled]:!opacity-0 transition-opacity" />
                                <button onClick={() => setRandomThemedPlayerHand(cardHelpers.fetchGlassCannonCards)} className="disabled:opacity-30 cursor-pointer">Glass Cannons</button>
                            </div>
                            <div className="hidden md:block relative group">
                                <div className="arrow absolute -left-4 top-1 -translate-y-1/2 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 group-has-[:disabled]:!opacity-0 transition-opacity" />
                                <button onClick={() => setRandomThemedPlayerHand(cardHelpers.fetchAllStarterLineCards)} className="disabled:opacity-30 cursor-pointer">Starter & Evolutions</button>
                            </div>
                            <div className="relative group">
                                <div className="arrow absolute -left-4 top-1 -translate-y-1/2 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 group-has-[:disabled]:!opacity-0 transition-opacity" />
                                <button onClick={() => setRandomThemedPlayerHand(cardHelpers.fetchFossilCards)} className="disabled:opacity-30 cursor-pointer">Fossil Cards</button>
                            </div>
                            {debugMode && (
                                <div className="relative group">
                                    <div className="arrow absolute -left-4 top-1 -translate-y-1/2 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 group-has-[:disabled]:!opacity-0 transition-opacity" />
                                    <button onClick={() => setRandomThemedPlayerHand(cardHelpers.fetchSecretCards)} className="disabled:opacity-30 cursor-pointer">秘密 (debug)</button>
                                </div>
                            )}
                        </div>
                        <div className='text-[8px] md:text-base md:ml-5'>
                            {gameData.types.filter(type => !['steel', "ghost", "dragon"].includes(type)).map(type => (
                                <div className="relative group" key={type}>
                                    <div className="arrow absolute -left-4 top-1 -translate-y-1/2 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 group-has-[:disabled]:!opacity-0 transition-opacity" />
                                    <button onClick={() => setRandomPlayerHandByType(type)} className="capitalize disabled:opacity-30 cursor-pointer">
                                        <span style={{ color: `var(--color-${type}-500)` }}>{type}</span>
                                    </button>
                                </div>
                            ))}
                        </div>
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