import { useEffect, useState, useMemo } from 'react';
import { getPokemonData } from '@/utils/pokeApi';
import Loader from "@/components/Loader/Loader.js";
import Image from 'next/image';

export default function Profile({ playerHand, lastPokemonCardSelected }) {
    const [pokemonData, setPokemonData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const filteredPlayerHand = playerHand.filter(Boolean);


    const TypeList = ({ types }) => {
        return types.map((type) => {
            return (
                <span
                    key={type}
                    className="capitalize text-white py-1 px-3"
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
            setIsLoading(true);
            setError(null);

            try {
                const data = await getPokemonData(lastPokemonCardSelected.name);

                setPokemonData(data);

                const pokemonCry = new Audio(data.cries.legacy);
                pokemonCry.volume = 0.5;
                pokemonCry.addEventListener('error', (error) => {
                    console.error(`Failed to play ${data.name} cry: `, error)
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

    useEffect(() => {
        if (!pokemonData) return;

        console.log(pokemonData)
    }, [pokemonData]) //delete after testing

    const allTypes = useMemo(() => new Set(filteredPlayerHand.flatMap(card => card.types)), [filteredPlayerHand]);

    const ProfileContent = () => {
        if (filteredPlayerHand.length < 1) (
            <h1>Hello!</h1>
        )

        return (
            <div className='grid grid-cols-2 grid-rows-3 h-full'>
                <div>
                    <h3 className='font-bold text-lg mb-2'>Your Team</h3>
                    <ul className="text-sm">
                        {/* <hr className="border-2 my-2" /> */}
                        {filteredPlayerHand.map(pokemonCard => (
                            <li className='capitalize'>{pokemonCard.name}</li>
                        ))}
                    </ul>
                </div>
                <div>
                    <h3 className='font-bold text-lg mb-2'>Selected Types</h3>
                    <ul className='flex flex-wrap gap-2 text-sm'>
                        {/* <hr className="border-2 my-2" /> */}
                        {Array.from(allTypes).map(type => (
                            <li key={type} className='inline-block capitalize text-white py-1 px-3' style={{ backgroundColor: `var(--color-${type}-500)` }}>{type}</li>
                        ))}
                    </ul>
                </div>
                <div className="col-span-2">
                    <h3 className='font-bold text-lg mb-2'>Your Stats</h3>
                    <ul className="text-sm">
                        <li>Most played card: Bulbasaur</li>
                        <li>Favourite type: <span className='inline-block capitalize text-white py-0.5 px-2 text-xs' style={{ backgroundColor: `var(--color-normal-500)` }}>Normal</span></li>
                        <li>Times won: 0</li>
                        <l1>Artifacts discovered: 0</l1>
                    </ul>
                </div>
            </div>
        );
    };

    // {
    //     pokemonData && (
    //         <Image draggable={false} width={80} height={80} className="drop-shadow-md/30 z-10" alt={lastPokemonCardSelected.name} src={pokemonData.sprites.other["official-artwork"].front_default} />
    //     )
    // }

    // <TypeList types={lastPokemonCardSelected.types} />


    return (
        <div className='relative flex-1 default-tile p-8 border-x-4 border-black font-press-start text-lg'>
            {isLoading ? (
                <Loader />
            ) : (
                <ProfileContent />
            )}
        </div>
    );
}