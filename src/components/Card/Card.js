import React, { useState, useEffect, useRef, useMemo } from 'react';
import Image from 'next/image'
import PokemonBallSprite from '@/assets/icons/tiers/Bag_Poké_Ball_Sprite.png'
import ElementalTypes from '../ElementalTypes/ElementalTypes.js';
import Stats from '../Stats/Stats.js';
import { useDraggable } from '@dnd-kit/core';

export default function Card({ pokemonCard, index = 0, isDraggable = true, isPlacedInGrid = false, roundCorners = true, startsFlipped = true, element, isUnselected = false }) {
    const [isFlipped, setIsFlipped] = useState(startsFlipped);
    const cardRef = useRef(null);
    const prevIsPlayerCard = useRef();

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
        if (isUnselected) {
            return 'bg-gradient-to-b from-neutral-300 to-neutral-500';
        }
        return pokemonCard.isPlayerCard
            ? 'bg-gradient-to-b from-theme-blue to-theme-blue-100'
            : 'bg-gradient-to-b from-theme-red to-theme-red-100';
    }, [pokemonCard.isPlayerCard, isUnselected]);

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
                setTimeout(resolve, 400);
            } else {
                resolve();
            }
        });
    };

    const defeatCard = () => {
        return new Promise((resolve) => {
            if (cardRef.current) {
                cardRef.current.classList.remove('rotate-diagonal');

                cardRef.current.classList.add('rotate-diagonal')
                setTimeout(resolve, 400);
            } else {
                resolve();
            }
        });
    };

    const [showOverlay, setShowOverlay] = useState(false);

    const runAnimations = async () => {
        if (!pokemonCard.isPlayerCard) {
            await dropCard(); // Wait for drop to finish
        }

        // Check if this card made a super effective capture
        if (pokemonCard.wasSuperEffective) {
            setShowOverlay(true);
            setTimeout(() => setShowOverlay(false), 400);
            return;
        }

        // Check if this card's attack was immune
        if (pokemonCard.wasImmune) {
            setShowOverlay(true);
            setTimeout(() => setShowOverlay(false), 400);
            return;
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
        }
    }, [isPlacedInGrid])

    useEffect(() => {
        if (prevIsPlayerCard.current !== undefined && prevIsPlayerCard.current !== pokemonCard.isPlayerCard) {
            if (isPlacedInGrid) {
                defeatCard();
            }
        }

        // Update the previous value for next comparison
        prevIsPlayerCard.current = pokemonCard.isPlayerCard;
    }, [pokemonCard.isPlayerCard])

    useEffect(() => {
        if (!startsFlipped) {
            const animationDelay = 150;

            setTimeout(() => {
                setIsFlipped(!isFlipped)
            }, index * animationDelay + (pokemonCard.isPlayerCard ? 0 : animationDelay * 5));
        }
    }, [])

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
            <div ref={cardRef} className={`relative p-2 lg:p-3 border-front ${roundCorners ? "rounded-md" : ""} aspect-square ${isFlipped ? 'card-shown' : 'card-hidden'}`}>
                <div className={`${bgGradient} relative w-full aspect-square rounded-sm border-1 shadow-inner border-black/80 overflow-hidden`}>
                    <div className="relative h-full flex flex-col items-center justify-center">
                        <Stats stats={pokemonCard.stats} originalStats={pokemonCard.originalStats} />
                        <ElementalTypes types={pokemonCard.types} />
                        <Image draggable={false} width={80} height={80} className="drop-shadow-md/40 z-10" alt={pokemonCard.name} src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemonCard.id}.png`} />
                        <div className='absolute bottom-0'>
                            <svg className="w-full drop-shadow-md -mb-px rotate-180" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 100"><path d="M0 0v4c250 0 250 96 500 96S750 4 1000 4V0H0Z" fill={isUnselected ? "#d4d4d4" : (pokemonCard.isPlayerCard ? "#7dbdff" : "#ff6d64")}></path></svg>
                            <div className={`pt-10 text-center w-full ${isUnselected ? "bg-neutral-300" : (pokemonCard.isPlayerCard ? "bg-theme-blue-accent" : "bg-theme-red-accent")}`} />
                            <div className="px-2 py-1 w-full text-center uppercase text-white text-[10px] lg:text-xs font-bold truncate text-shadow-sm/30 tracking-widest border-t-1 border-black/80" style={getNameBgStyle()}>{pokemonCard.name}</div>
                        </div>
                    </div>
                </div>
                {pokemonCard.playerOwned && <Image width={24} height={24} alt="Player owned card" className="absolute bottom-0 right-0" src={PokemonBallSprite} />}
                {showOverlay && (
                    <div id="effect-overlay" className={`z-20 absolute top-0 left-0 w-full h-full bg-linear-to-b from-black/40 via-black-30 to-black/60 text-shadow-md/60 font-press-start flex justify-center items-center text-center text-white text-xs p-4 ${roundCorners ? "rounded-md" : ""}`}>
                        <span className='mt-4'>{pokemonCard.wasSuperEffective ? "SUPER EFFECTIVE!" : pokemonCard.wasImmune ? "NO EFFECT!" : "NOT EFFECTIVE!"}</span>
                    </div>
                )}
            </div>
            <div className={`border-back absolute top-0 left-0 w-full rounded-md p-3 select-none aspect-square shadow ${!isFlipped ? 'card-shown' : 'card-hidden'}`}>
                <div className="bg-[url('@/assets/textures/card-back.png')] bg-center bg-cover aspect-square">
                </div>
            </div>
        </div>
    );
}