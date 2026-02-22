import React, { useState, useEffect, useRef, useMemo } from 'react';
import abilities from '@/data/ability-data.json';

import { useDraggable } from '@dnd-kit/core';
import { useAuth } from '@/contexts/AuthContext';
import { useTooltip } from '@/hooks/useTooltip';
import { useCardAnimations } from '@/hooks/useCardAnimations';
import { statLoweringImmunityAbilities } from '@/utils/abilityHandlers';

import CardFront from './CardFront.js';
import CardBack from './CardBack.js';
import CardTooltip from './CardTooltip.js';

function Card({ pokemonCard, index = 0, cellKey, isDraggable = true, isPlacedInGrid = false, roundCorners = true, startsFaceUp = true, isUnselected = false, snapshot = false, showTooltip = true }) {
    const { isVisible, handlers } = useTooltip();
    const { hasCard } = useAuth();

    const [tooltipPosition, setTooltipPosition] = useState('top');
    const [isFlipped, setIsFlipped] = useState(startsFaceUp);

    const cardRef = useRef(null);

    if (!pokemonCard) {
        return null;
    }

    const hasAbility = pokemonCard.ability;
    const hasSheenAbility = statLoweringImmunityAbilities.includes(pokemonCard.ability);
    const isOwned = hasCard(pokemonCard.name) || pokemonCard.starter;

    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
        id: `${pokemonCard.id.toString()}-${cellKey}-${pokemonCard.isPlayerCard ? "player" : "cpu"}`,
        disabled: !isDraggable,
        data: {
            pokemonCard,
            index
        }
    });

    const style = transform ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    } : undefined;

    const { statDelta, showOverlay, handleStatChange } = useCardAnimations(cardRef, pokemonCard, isPlacedInGrid, snapshot);

    const bgGradient = useMemo(() => {
        if (isUnselected) {
            return 'bg-gradient-to-b from-neutral-300 to-neutral-500';
        }
        return pokemonCard.isPlayerCard
            ? 'bg-gradient-to-b from-theme-blue to-theme-blue-100'
            : 'bg-gradient-to-b from-theme-red to-theme-red-100';
    }, [pokemonCard.isPlayerCard, isUnselected]);

    const nameBgStyle = useMemo(() => {
        if (pokemonCard.types.length === 1) {
            return { backgroundColor: `var(--color-${pokemonCard.types[0]}-500)` };
        }
        return {
            backgroundImage: `linear-gradient(to right, var(--color-${pokemonCard.types[0]}-500) 50%, var(--color-${pokemonCard.types[1]}-500) 50%)`
        };
    }, [pokemonCard.types]);

    const abilityBgStyle = useMemo(() => {
        return { backgroundColor: `var(--color-${abilities[pokemonCard.ability]?.type || "normal"}-500)` };
    }, [pokemonCard.ability]);

    useEffect(() => {
        if (!startsFaceUp) {
            const animationDelay = 150;
            setTimeout(() => {
                setIsFlipped(true);
            }, index * animationDelay + (pokemonCard.isPlayerCard ? 0 : animationDelay * 5));
        }
    }, []);

    useEffect(() => {
        if (isVisible && cardRef.current) {
            const rect = cardRef.current.getBoundingClientRect();
            const cardCenterY = rect.top + rect.height / 2;
            setTooltipPosition(cardCenterY < window.innerHeight / 3 ? 'bottom' : 'top');
        }
    }, [isVisible]);

    return (
        <div
            className={`relative select-none ${isDraggable ? "cursor-pointer touch-none" : "cursor-not-auto"} ${transform ? "z-20 shadow-lg/30 scale-105" : ""}`}
            ref={setNodeRef}
            style={style}
            {...(isDraggable ? listeners : {})}
            {...(isDraggable ? attributes : {})}
            {...handlers}
        >
            <div ref={cardRef} className="relative" style={{
                transformStyle: 'preserve-3d',
                transform: `${isFlipped ? 'rotateY(0deg)' : 'rotateY(180deg)'}`,
                transition: 'transform 0.3s ease-out'
            }}>
                <CardFront
                    pokemonCard={pokemonCard}
                    bgGradient={bgGradient}
                    isOwned={isOwned}
                    hasSheenAbility={hasSheenAbility}
                    isPlacedInGrid={isPlacedInGrid}
                    roundCorners={roundCorners}
                    showOverlay={showOverlay}
                    statDelta={statDelta}
                    snapshot={snapshot}
                    nameBgStyle={nameBgStyle}
                    handleStatChange={handleStatChange}
                    isUnselected={isUnselected}
                />
                <CardBack roundCorners={roundCorners} />
            </div>

            <CardTooltip
                pokemonCard={pokemonCard}
                isVisible={isVisible}
                isDragging={isDragging}
                tooltipPosition={tooltipPosition}
                abilityBgStyle={abilityBgStyle}
                showTooltip={showTooltip}
            />
        </div>
    );
}

export default Card;
