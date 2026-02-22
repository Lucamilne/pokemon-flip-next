import React from 'react';
import abilities from '@/data/ability-data.json';

function CardTooltip({ pokemonCard, isVisible, isDragging, tooltipPosition, abilityBgStyle, showTooltip }) {
    const hasAbility = pokemonCard.ability;

    if (!hasAbility || !showTooltip || !isVisible || isDragging) {
        return null;
    }

    return (
        <div className={`fade-in-b absolute z-10 text-xs pointer-events-none ${
            tooltipPosition === 'top' ? 'left-1/2 -translate-x-1/2 bottom-full mb-2' :
            tooltipPosition === 'bottom' ? 'left-1/2 -translate-x-1/2 top-full mt-2' :
            tooltipPosition === 'left' ? 'right-full mr-2 top-1/2 -translate-y-1/2' :
            'left-full ml-2 top-1/2 -translate-y-1/2'
        }`}>
            <div className='border border-black tooltip p-1 w-[105px] md:w-[140px] shadow-md/30'>
                {abilities[pokemonCard.ability]?.trigger !== 'statusEffect' && (
                    <div className="truncate text-[8px] p-0.5 md:py-1 md:text-xs uppercase md:tracking-wider text-center font-bold text-white" style={abilityBgStyle}>
                        {abilities[pokemonCard.ability]?.name}
                    </div>
                )}
                <p className="text-[8px] md:text-[10px] py-1 md:py-2 px-[1px] text-center">
                    {abilities[pokemonCard.ability]?.description}
                    {pokemonCard.wasMetronome && ' (via Metronome)'}
                    {pokemonCard.wasMirrorMove && ' (via Mirror Move)'}
                </p>
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
    );
}

export default CardTooltip;
