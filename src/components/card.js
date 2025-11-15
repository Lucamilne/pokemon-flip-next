import React, { useState, useEffect, useMemo } from 'react';
import Image from 'next/image'
import PokemonBallSprite from '@/assets/icons/tiers/Bag_Poké_Ball_Sprite.png'
import ElementalTypes from './elemental-types.js';
import Stats from './stats.js';

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
                <div className={`${bgGradient} relative w-full aspect-square border border-1 border-black overflow-hidden`}>
                    <div className="relative h-full flex flex-col items-center justify-center shadow-inner">
                        <Stats stats={pokemonCard.stats} originalStats={pokemonCard.originalStats} />
                        <ElementalTypes types={pokemonCard.types} />
                        <Image width={96} height={96} className="mt-2 z-10" alt={pokemonCard.name} src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonCard.id}.png`} />
                        <div className='absolute bottom-0'>
                            <svg className="w-full rotate-180" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 100"><path d="M0 0v4c250 0 250 96 500 96S750 4 1000 4V0H0Z" fill={isPlayerCard ? "#7dbdff" : "#ff6d64"}></path></svg>
                            <div className={`pt-6 px-2 py-1.5 text-center text-white text-xs font-bold truncate text-black bg-black w-full uppercase text-shadow-md ${isPlayerCard ? "bg-theme-blue-accent" : "bg-theme-red-accent"}`}>
                                <span className={`${pokemonCard.rarity} px-2 py-0.5 rounded-full shadow-md tracking-widest`}>{pokemonCard.name}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className={`border-back absolute top-0 left-0 w-full rounded-md p-3 select-none aspect-square shadow ${!isFlipped ? 'card-shown' : 'card-hidden'}`}>
                <div className="bg-[url('@/assets/textures/card-back.png')] bg-center bg-cover aspect-square">
                </div>
            </div>
            {pokemonCard.playerOwned && <Image width={24} height={24} className="absolute bottom-0 left-0" src={PokemonBallSprite} />}
        </div>
    );
}