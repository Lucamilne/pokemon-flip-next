import Card from '@/components/Card/Card.js';

export default function HandSlot({ pokemonCard, index, isPlayerHand, isDraggable, isRevealed }) {
    const backgroundClass = isPlayerHand ? 'bg-pokedex-inner-blue' : 'bg-pokedex-inner-red';

    return (
        <div className="relative aspect-square">
            <div className={`absolute top-1 left-1 bottom-1 right-1 rounded-md m-1 ${backgroundClass}`} />
            {pokemonCard && isRevealed && (
                <Card
                    pokemonCard={pokemonCard}
                    index={index}
                    isDraggable={isDraggable}
                    startsFaceUp={isPlayerHand}
                />
            )}
        </div>
    );
}
