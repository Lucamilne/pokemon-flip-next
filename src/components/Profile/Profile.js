import { useEffect, useState, useMemo } from 'react';
import { getPokemonData, getPokemonSpeciesData } from '@/utils/pokeApi';
import Loader from "@/components/Loader/Loader.js";


export default function Profile({ playerHand, lastPokemonCardSelected }) {
    const [pokemonData, setPokemonData] = useState(null);
    const [evolutionChain, setEvolutionChain] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const TypeList = ({ types = [] }) => {
        return types.map((type) => {
            return (
                <span
                    key={type}
                    className="capitalize text-white py-1 px-3 mr-2"
                    style={{ backgroundColor: `var(--color-${type}-500)` }}
                >
                    {type}
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

                const pokemonCry = new Audio(combinedData.cries.legacy);
                pokemonCry.volume = 0.5;
                pokemonCry.addEventListener('error', (error) => {
                    console.error(`Failed to play ${combinedData.name} cry: `, error)
                })
                pokemonCry.play();
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

        return (
            <div className='h-full p-8 overflow-y-auto hide-scrollbar'>
                <div>
                    <h3 className="mb-2">
                        <span className="capitalize text-lg font-bold mr-4">{lastPokemonCardSelected?.name}</span>
                        <span>#{lastPokemonCardSelected?.id}</span>
                    </h3>
                    <TypeList types={lastPokemonCardSelected?.types} />
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
            {isLoading ? (
                <Loader />
            ) : (
                <ProfileContent />
            )}
        </div>
    );
}