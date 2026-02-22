import React from 'react';

function CardBack({ roundCorners }) {
    return (
        <div
            className={`border-back absolute top-0 left-0 w-full rounded-md p-[5px] sm:p-[9px] select-none aspect-square shadow`}
            style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
        >
            <div className="bg-[url('@/assets/textures/card-back.png')] bg-center bg-cover aspect-square" />
        </div>
    );
}

export default CardBack;
