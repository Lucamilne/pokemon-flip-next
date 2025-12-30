import React, { useState, useEffect, useRef, useMemo } from 'react';
import PokemonBallSprite from '@/assets/icons/tiers/Bag_Poké_Ball_Sprite.png'
import GreatBallSprite from '@/assets/icons/tiers/Bag_Great_Ball_Sprite.png'
import UltraBallSprite from '@/assets/icons/tiers/Bag_Ultra_Ball_Sprite.png'
import MasterBallSprite from '@/assets/icons/tiers/Bag_Master_Ball_Sprite.png'
import ElementalTypes from '../ElementalTypes/ElementalTypes.js';
import Stats from '../Stats/Stats.js';

import { useDraggable } from '@dnd-kit/core';
import { useAuth } from '@/contexts/AuthContext';
import { useGameContext } from '@/contexts/GameContext';
import { useTooltip } from '@/hooks/useTooltip';
import gameData from '@/data/game-data.json';

const { abilities } = gameData;

// Utility functions
const sumUpNumbersInArray = (array) => {
    return array.reduce((acc, val) => acc + val, 0);
};

// Unused currently, may make a return
const getBallSprite = (statWeight) => {
    if (statWeight < 395) return PokemonBallSprite;
    if (statWeight < 500) return GreatBallSprite;
    if (statWeight < 600) return UltraBallSprite;
    return MasterBallSprite;
};

export default function Card({ pokemonCard, index = 0, cellKey, isDraggable = true, isPlacedInGrid = false, roundCorners = true, startsFlipped = true, isUnselected = false }) {
    const { isMobile } = useGameContext();
    const [isFlipped, setIsFlipped] = useState(startsFlipped);
    const cardRef = useRef(null);
    const prevIsPlayerCard = useRef();
    const { isVisible, handlers } = useTooltip(500); // 500ms long press
    const [tooltipPosition, setTooltipPosition] = useState('top');

    if (!pokemonCard) {
        return null;
    }

    const hasAbility = pokemonCard.ability;

    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
        id: `${pokemonCard.id.toString()}-${cellKey}-${pokemonCard.isPlayerCard ? "player" : "cpu"}`,
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
                cardRef.current.classList.add('slide-in-blurred-top')
                setTimeout(resolve, 400);
            } else {
                resolve();
            }
        });
    };

    const defeatCard = () => {
        return new Promise((resolve) => {
            if (cardRef.current) {
                cardRef.current.classList.remove('wobble-hor-bottom', 'jello-horizontal', 'slide-in-blurred-top');

                // Force a reflow to ensure the browser has committed the current state. This is to fix a transition property issue with animations playing instantly
                cardRef.current.offsetHeight;

                // Use requestAnimationFrame to ensure the browser has painted before changing state
                requestAnimationFrame(() => {
                    cardRef.current.classList.add('rotate-vert-center', 'z-50')
                    setTimeout(() => {
                        cardRef.current.classList.remove('rotate-vert-center', 'z-50')
                        resolve();
                    }, 400);
                });
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
        }

        // Check if this card's attack was immune
        if (pokemonCard.wasNoEffect) {
            setShowOverlay(true);
            setTimeout(() => setShowOverlay(false), 400);
        }

        // if (!cellKey || !cells[cellKey]?.element) return;

        const totalStats = sumUpNumbersInArray(pokemonCard.stats);
        const totalOriginalStats = sumUpNumbersInArray(pokemonCard.originalStats);

        if (totalStats < totalOriginalStats) {
            await weakenCard();
        } else if (totalStats > totalOriginalStats) {
            await strengthenCard();
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
                setIsFlipped(true)
            }, index * animationDelay + (pokemonCard.isPlayerCard ? 0 : animationDelay * 5));
        }
    }, [])

    useEffect(() => {
        if (isVisible && cardRef.current) {
            const rect = cardRef.current.getBoundingClientRect();
            const viewportHeight = window.innerHeight;
            const viewportWidth = window.innerWidth;
            const cardCenter = rect.top + rect.height / 2;
            const cardCenterX = rect.left + rect.width / 2;

            // if (isMobile) {
            //     setTooltipPosition(cardCenterX < viewportWidth / 2 ? 'right' : 'left');
            // } else {
                setTooltipPosition(cardCenter < viewportHeight / 4 ? 'bottom' : 'top');
            // }
        }
    }, [isVisible])

    const nameBgStyle = useMemo(() => {
        if (pokemonCard.types.length === 1) {
            return { backgroundColor: `var(--color-${pokemonCard.types[0]}-500)` };
        }
        return {
            backgroundImage: `linear-gradient(to right, var(--color-${pokemonCard.types[0]}-500) 50%, var(--color-${pokemonCard.types[1]}-500) 50%)`
        };
    }, [pokemonCard.types]);

    return (
        <div
            className={`relative select-none ${isDraggable ? "cursor-pointer touch-none" : "cursor-not-auto"} ${transform ? "z-20 shadow-lg/30 scale-105" : ""}`}
            ref={setNodeRef}
            style={style}
            {...listeners}
            {...attributes}
            {...(hasAbility ? handlers : {})}
        >
            <div ref={cardRef} className="relative" style={{
                transformStyle: 'preserve-3d',
                transform: `${isFlipped ? 'rotateY(0deg)' : 'rotateY(180deg)'}`,
                transition: 'transform 0.3s ease-out'
            }}>
                <div className={`relative p-[5px] sm:p-[9px] border-front ${roundCorners ? "rounded-md" : ""} aspect-square`}
                    style={{
                        backfaceVisibility: 'hidden',
                        WebkitBackfaceVisibility: 'hidden',
                    }}
                >
                    <div className={`${bgGradient} relative w-full aspect-square rounded-sm border-1 shadow-inner border-black/80 overflow-hidden`}>
                        <div className="relative h-full flex flex-col items-center justify-center">
                            <Stats stats={pokemonCard.stats} originalStats={pokemonCard.originalStats} />
                            <ElementalTypes types={pokemonCard.types} />
                            <img loading="lazy" draggable={false} width={60} height={60} className="w-1/2 h-1/2 md:size-[60px] drop-shadow-md/40 z-10" alt={pokemonCard.name} src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemonCard.id}.png`} style={{ WebkitTouchCallout: 'none', WebkitUserSelect: 'none', userSelect: 'none' }} />
                            <div className='absolute bottom-0'>
                                <svg className="w-full drop-shadow-md -mb-px rotate-180" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 100"><path d="M0 0v4c250 0 250 96 500 96S750 4 1000 4V0H0Z" fill={isUnselected ? "#d4d4d4" : (pokemonCard.isPlayerCard ? "#7dbdff" : "#ff6d64")}></path></svg>
                                <div className={`pt-7 text-center w-full ${isUnselected ? "bg-neutral-300" : (pokemonCard.isPlayerCard ? "bg-theme-blue-accent" : "bg-theme-red-accent")}`} />
                                <div className="px-2 py-0.5 w-full text-center uppercase text-white text-[6px] md:text-[10px] font-bold truncate text-shadow-sm/30 tracking-widest border-t-1 border-black/80" style={nameBgStyle}>{pokemonCard.name}</div>
                            </div>
                        </div>
                    </div>
                    {hasAbility && <img width={24} height={24} alt="Ability enabled card" className="size-[14px] md:size-[24px] absolute bottom-0 right-0" src={PokemonBallSprite} style={{ WebkitTouchCallout: 'none', WebkitUserSelect: 'none', userSelect: 'none' }} />}
                    {showOverlay && (
                        <div id="effect-overlay" className={`z-20 absolute top-0 left-0 w-full h-full bg-linear-to-b from-black/40 via-black-30 to-black/60 text-shadow-md/60 font-press-start flex justify-center items-center text-center text-white text-[6px] md:text-[10px] p-4 ${roundCorners ? "rounded-md" : ""}`}>
                            <span className='mt-4 '>{pokemonCard.wasSuperEffective ? "SUPER EFFECTIVE!" : pokemonCard.wasNoEffect ? "NO EFFECT!" : "NOT EFFECTIVE!"}</span>
                        </div>
                    )}
                </div>
                <div className={`border-back absolute top-0 left-0 w-full rounded-md p-[5px] sm:p-[9px] select-none aspect-square shadow`} style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}>
                    <div className="bg-[url('@/assets/textures/card-back.png')] bg-center bg-cover aspect-square">
                    </div>
                </div>
            </div>

            {/* Ability Tooltip */}
            {hasAbility && isVisible && !isDragging && (
                <div className={`fade-in-b absolute z-10 text-xs pointer-events-none ${tooltipPosition === 'top' ? 'left-1/2 -translate-x-1/2 bottom-full mb-2' :
                    tooltipPosition === 'bottom' ? 'left-1/2 -translate-x-1/2 top-full mt-2' :
                        tooltipPosition === 'left' ? 'right-full mr-2 top-1/2 -translate-y-1/2' :
                            'left-full ml-2 top-1/2 -translate-y-1/2'
                    }`}>
                    <div className='border border-black tooltip p-1 w-[90px] md:w-[140px] shadow-md/30'>
                        <div className="truncate text-[8px] md:text-sm uppercase tracking-wider text-center font-bold text-white" style={nameBgStyle}>
                            {abilities[pokemonCard.ability]?.name}
                        </div>
                        <p className="text-[8px] md:text-[10px] py-2 px-[1px] text-center">
                            {abilities[pokemonCard.ability]?.description}
                        </p>
                        {/* Arrow */}
                        {tooltipPosition === 'top' && (
                            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[8px] border-t-black" />
                        )}
                        {tooltipPosition === 'bottom' && (
                            <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-b-[8px] border-b-black" />
                        )}
                        {tooltipPosition === 'left' && (
                            <div className="absolute -right-2 top-1/2 -translate-y-1/2 w-0 h-0 border-t-[8px] border-t-transparent border-b-[8px] border-b-transparent border-l-[8px] border-l-black" />
                        )}
                        {tooltipPosition === 'right' && (
                            <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-0 h-0 border-t-[8px] border-t-transparent border-b-[8px] border-b-transparent border-r-[8px] border-r-black" />
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}