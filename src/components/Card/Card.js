import React, { useState, useEffect, useRef, useMemo } from 'react';
import Image from 'next/image'
import PokemonBallSprite from '@/assets/icons/tiers/Bag_Poké_Ball_Sprite.png'
import ElementalTypes from '../ElementalTypes/ElementalTypes.js';
import Stats from '../Stats/Stats.js';
import { useDraggable } from '@dnd-kit/core';

export default function Card({ pokemonCard, index, isDraggable = true, isPlacedInGrid = false, selectMode = false }) {
    const [isFlipped, setIsFlipped] = useState(isPlacedInGrid);
        const cardRef = useRef(null);

        if (!pokemonCard) {
            return null;
        }

    const sumUpNumbersInArray = (array) => {
        return array.reduce((acc, val) => acc + val, 0);
    };

    const { attributes, listeners, setNodeRef, transform } = useDraggable({
        id: `${pokemonCard.id.toString()}-${pokemonCard.isPlayerCard ? "-player" : "-cpu"}`, // it's possible that the cpu may have the same card as a player, we need to distinguish IDs
        disabled: !isDraggable,
        data: {
            pokemonCard,
            index
        }
    });

    // Apply transform to show dragging movement
    const style = transform ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    } : undefined;


    const bgGradient = useMemo(() => {
        return pokemonCard.isPlayerCard
            ? 'bg-gradient-to-br from-theme-blue to-theme-blue-100'
            : 'bg-gradient-to-br from-theme-red to-theme-red-100';
    }, [pokemonCard.isPlayerCard]);

    const weakenCard = () => {
        return new Promise((resolve) => {
            if (cardRef.current) {
                cardRef.current.classList.add('wobble-hor-bottom')
                setTimeout(resolve, 500);
            } else {
                resolve();
            }
        });
    };

    const strengthenCard = () => {
        return new Promise((resolve) => {
            if (cardRef.current) {
                cardRef.current.classList.add('jello-horizontal')
                setTimeout(resolve, 500);
            } else {
                resolve();
            }
        });
    };

    const dropCard = () => {
        return new Promise((resolve) => {
            if (cardRef.current) {
                cardRef.current.classList.add('slide-in-bck-top')
                setTimeout(resolve, 300);
            } else {
                resolve();
            }
        });
    };

    const runAnimations = async () => {
        if (!pokemonCard.isPlayerCard) {
            await dropCard(); // Wait for drop to finish
        }

        const totalStats = sumUpNumbersInArray(pokemonCard.stats);
        const totalOriginalStats = sumUpNumbersInArray(pokemonCard.originalStats);

        if (totalStats < totalOriginalStats) {
            weakenCard();
        } else if (totalStats > totalOriginalStats) {
            strengthenCard();
        }
    };

    useEffect(() => {
        if (isPlacedInGrid) {
            runAnimations();
        } else {
            const animationDelay = 150;

            setTimeout(() => {
                setIsFlipped(!isFlipped)
            }, index * animationDelay + (pokemonCard.isPlayerCard ? 0 : animationDelay * 5));
        }
    }, [isPlacedInGrid])

    // used for rarity border, unused currently
    const getBgStyle = () => {
        return {
            backgroundImage: `linear-gradient(to right, var(--color-${pokemonCard.types[0]}-500), var(--color-${pokemonCard.types[1]}-500))`
        };
    };

    const getNameBgStyle = () => {
        if (pokemonCard.types.length === 1) {
            return { backgroundColor: `var(--color-${pokemonCard.types[0]}-500)` };
        }
        return {
            backgroundImage: `linear-gradient(to right, var(--color-${pokemonCard.types[0]}-500) 50%, var(--color-${pokemonCard.types[1]}-500) 50%)`
        };
    };

    return (
        <div className={`relative select-none touch-none ${isDraggable ? "cursor-pointer" : "cursor-not-auto"} ${transform ? "z-20 shadow-lg/30 scale-105" : ""}`} ref={setNodeRef}
            style={style}
            {...listeners}
            {...attributes}
        >
            <div ref={cardRef} className={`p-2.5 border-front ${isPlacedInGrid && !selectMode ? "" : "rounded-md"} aspect-square ${isFlipped ? 'card-shown' : 'card-hidden'}`}>
                <div className={`${bgGradient} relative w-full aspect-square rounded-sm border-1 shadow-inner border-black/80 overflow-hidden`}>
                    <div className="relative h-full flex flex-col items-center justify-center">
                        <Stats stats={pokemonCard.stats} originalStats={pokemonCard.originalStats} />
                        <ElementalTypes types={pokemonCard.types} />
                        <Image draggable={false} loading="eager" width={96} height={96} className="drop-shadow-md/30 z-10" alt={pokemonCard.name} src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonCard.id}.png`} />
                        <div className='absolute bottom-0'>
                            <svg className="w-full drop-shadow-md -mb-px rotate-180" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 100"><path d="M0 0v4c250 0 250 96 500 96S750 4 1000 4V0H0Z" fill={pokemonCard.isPlayerCard ? "#7dbdff" : "#ff6d64"}></path></svg>
                            <div className={`pt-10 text-center w-full ${pokemonCard.isPlayerCard ? "bg-theme-blue-accent" : "bg-theme-red-accent"}`} />
                            <div className="px-2 py-1 w-full text-center uppercase text-white text-[10px] lg:text-xs font-bold truncate text-shadow-sm/30 tracking-widest border-t-1 border-black/80" style={getNameBgStyle()}>{pokemonCard.name}</div>
                        </div>
                    </div>
                </div>
                {pokemonCard.playerOwned && <Image width={24} height={24} alt="Player owned card" className="absolute bottom-0 right-0" src={PokemonBallSprite} />}
            </div>
            <div className={`border-back absolute top-0 left-0 w-full rounded-md p-3 select-none aspect-square shadow ${!isFlipped ? 'card-shown' : 'card-hidden'}`}>
                <div className="bg-[url('@/assets/textures/card-back.png')] bg-center bg-cover aspect-square">
                </div>
            </div>
        </div>
    );
}