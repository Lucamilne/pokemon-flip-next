import Card from '@/components/Card/Card.js';

export default function SelectableCard({ pokemonCard, index, isSelected, onSelect }) {
    return (
        <button className={`cursor-pointer relative rounded-md aspect-square transition-transform shadow-md/15 ${isSelected ? 'ring-3 md:ring-5 ring-lime-300' : ''}`} onClick={() => onSelect(pokemonCard)}>
            <Card isUnselected={!isSelected} pokemonCard={pokemonCard} index={index} isDraggable={false} />
        </button>
    );
}
