import Card from '@/components/Card/Card.js';

export default function HandSlot({ pokemonCard, index, onCardClick }) {
    return (
        <button className={`relative aspect-square ${pokemonCard ? 'cursor-pointer' : ''}`} onClick={() => onCardClick(pokemonCard)}>
            <div className="absolute top-1 left-1 bottom-1 right-1 rounded-md m-1 bg-pokedex-inner-blue flex justify-center items-center"><span className="header-text text-xl md:text-2xl">{index + 1}</span></div>
            {pokemonCard && <div className="slide-in-blurred-top"><Card pokemonCard={pokemonCard} index={index} isDraggable={false} /></div>}
        </button>
    );
}
