import React from 'react';
import ElementalTypes from '../ElementalTypes/ElementalTypes.js';
import Stats from '../Stats/Stats.js';
import CardImage from './CardImage.js';
import CardName from './CardName.js';
import CardBallSprite from './CardBallSprite.js';

function CardFront({ pokemonCard, bgGradient, isOwned, hasSheenAbility, isPlacedInGrid, roundCorners, showOverlay, statDelta, snapshot, nameBgStyle, handleStatChange, isUnselected }) {
    return (
        <div
            className={`relative p-[5.5px] md:p-[9px] border-front ${roundCorners ? "rounded-md" : ""} aspect-square`}
            style={{
                backfaceVisibility: 'hidden',
                WebkitBackfaceVisibility: 'hidden',
            }}
        >
            <div className={`${bgGradient} relative w-full aspect-square rounded-sm border-1 shadow-inner border-black/80 overflow-hidden ${hasSheenAbility && isPlacedInGrid ? 'sheen-effect' : ''}`}>
                <div className="relative h-full flex flex-col items-center justify-center">
                    <Stats stats={pokemonCard.stats} originalStats={pokemonCard.originalStats} onStatChange={handleStatChange} />
                    <ElementalTypes types={pokemonCard.types} />
                    <CardImage id={pokemonCard.id} name={pokemonCard.name} />
                    <CardName
                        name={pokemonCard.name}
                        isPlayerCard={pokemonCard.isPlayerCard}
                        isUnselected={isUnselected}
                        nameBgStyle={nameBgStyle}
                    />
                </div>
            </div>
            <CardBallSprite isOwned={isOwned} statWeight={pokemonCard.statWeight} />
            {showOverlay && (
                <div id="effect-overlay" className={`z-20 absolute top-0 left-0 size-full bg-linear-to-b from-black/40 via-black-30 to-black/60 text-shadow-md/60 font-press-start flex justify-center items-center text-center text-white text-[6px] md:text-[10px] p-4 ${roundCorners ? "rounded-md" : ""}`}>
                    <span className='mt-4'>{pokemonCard.wasSuperEffective ? "SUPER EFFECTIVE!" : pokemonCard.wasNoEffect ? "NO EFFECT!" : "NOT EFFECTIVE!"}</span>
                </div>
            )}
            {statDelta !== null && !snapshot && isPlacedInGrid && (
                <div className={`slide-top z-20 absolute inset-0 flex items-center justify-center pointer-events-none text-xs md:text-lg font-bold text-shadow-sm/50 md:text-shadow-lg/50 font-press-start ${statDelta > 0 ? 'text-lime-500' : 'text-red-600'}`}>
                    {statDelta > 0 ? `+${statDelta}` : statDelta}
                </div>
            )}
        </div>
    );
}

export default CardFront;
