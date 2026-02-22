import React from 'react';

function CardImage({ id, name }) {
    return (
        <img
            loading="lazy"
            draggable={false}
            width={60}
            height={60}
            className="w-1/2 h-1/2 md:size-[60px] drop-shadow-md/40 z-10"
            alt={name}
            src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`}
            style={{ WebkitTouchCallout: 'none', WebkitUserSelect: 'none', userSelect: 'none' }}
        />
    );
}

export default CardImage;
