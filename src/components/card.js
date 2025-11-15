import React, { useState, useEffect, useMemo } from 'react';
import Image from 'next/image'
import PokemonBallSprite from '@/assets/icons/tiers/Bag_Poké_Ball_Sprite.png'
import ElementalTypes from './elemental-types.js';

export default function Card({ pokemonCard, isPlayerCard, index }) {
    const [isFlipped, setIsFlipped] = useState(false);

    const bgGradient = useMemo(() => {
        return isPlayerCard
            ? 'bg-gradient-to-br from-theme-blue to-theme-blue-100'
            : 'bg-gradient-to-br from-theme-red to-theme-red-100';
    }, [isPlayerCard]);

    useEffect(() => {
        const animationDelay = 150;

        setTimeout(() => {
            setIsFlipped(!isFlipped)
        }, index * animationDelay + (isPlayerCard ? 0 : animationDelay * 5));
    }, []);

    return (
        <div className="relative select-none card">
            <div className={`p-3 border-front rounded-md aspect-square ${isFlipped ? 'card-shown' : 'card-hidden'}`}>
                <div className={`${bgGradient} relative w-full aspect-square border border-1 border-black`}>
                    <div className="relative h-full flex flex-col items-center justify-center shadow-inner">
                        <ElementalTypes types={pokemonCard.types} />
                        <Image width={96} height={96} className="mt-2 z-10" alt={pokemonCard.name} src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonCard.id}.png`} />
                        <div className={`text-xs truncate text-white text-center w-full pt-0.5 absolute bottom-0 drop-shadow uppercase text-shadow ${pokemonCard.rarity}`}>
                            <span>{pokemonCard.name}</span>
                        </div>
                    </div>
                    {/* <Stats className="absolute top-0 left-0 mt-0.5 z-20" stats={pokemonCard.stats} originalStats={pokemonCard.originalStats} /> */}
                </div>
            </div>
            <div className={`border-back absolute top-0 left-0 w-full rounded-md p-3 select-none aspect-square shadow ${!isFlipped ? 'card-shown' : 'card-hidden'}`}>
                <div className="bg-[url('@/assets/textures/card-back.png')] bg-center bg-cover aspect-square">
                </div>
            </div>
            {pokemonCard.playerOwned && <Image width={24} height={24} className="absolute bottom-0 right-0" src={PokemonBallSprite} />}
        </div>
    );
}