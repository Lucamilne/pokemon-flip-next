import React from 'react';

function CardName({ name, isPlayerCard, isUnselected, nameBgStyle }) {
    return (
        <div className='absolute bottom-0'>
            <svg className="w-full drop-shadow-md -mb-px rotate-180" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 100">
                <path d="M0 0v4c250 0 250 96 500 96S750 4 1000 4V0H0Z" fill={isUnselected ? "#d4d4d4" : (isPlayerCard ? "#7dbdff" : "#ff6d64")} />
            </svg>
            <div className={`pt-7 text-center w-full ${isUnselected ? "bg-neutral-300" : (isPlayerCard ? "bg-theme-blue-accent" : "bg-theme-red-accent")}`} />
            <div className="px-2 py-0.5 w-full text-center uppercase text-white text-[6px] md:text-[10px] font-bold truncate text-shadow-sm/30 tracking-widest border-t-1 border-black/80" style={nameBgStyle}>
                {name}
            </div>
        </div>
    );
}

export default CardName;
